import {
  Component, Input, ChangeDetectorRef, HostListener,
  ChangeDetectionStrategy, OnInit, AfterViewInit, Output, EventEmitter
} from '@angular/core';
import { D3Service, ForceDirectedGraph } from '../../../d3';
import { ArticleService } from './../../../service/article.service';
import APP_CONFIG from './../../../app.config';
import { Node, Link } from './../../../d3';
import { SUB_OPTIONS } from '../../../shared/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-area-graph',
  templateUrl: './area-graph.component.html',
  styleUrls: ['./area-graph.component.css']
})
export class AreaGraphComponent implements OnInit, AfterViewInit {
  nodes: Node[] = [];
  links: Link[] = [];
  graph: ForceDirectedGraph;
  private _options: { width, height } = { width: 800, height: 600 };
  //sub = SUB_OPTIONS.slice(1);


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(
    private d3Service: D3Service, 
    private ref: ChangeDetectorRef, 
    private articleService: ArticleService) {

  }

  ngOnInit() {
    this.articleService.getarea().subscribe(data => {
      console.log("returned data: ")
      console.log(data);
      const N = data.length,
        getIndex = number => number - 1;

      //APP_CONFIG.N = this.sub.length;

      // other node variable (not yet functional) //
      // const newNode = new Node(0);
      // newNode.name = 'others';
      // this.nodes.push(newNode);

      for (let i = 1; i < data.length; i++) {
        const newNode = new Node(i);
        newNode.name = data[i];
        this.nodes.push(newNode);
      }

      for (let i = 1; i < N; i++) {
        for (let m = 2; i * m < N; m++) {
          /** increasing connections toll on connecting nodes */
          this.nodes[getIndex(i)].linkCount++;
          this.nodes[getIndex(i * m)].linkCount++;

          /** connecting the nodes before starting the simulation */
          //this.links.push(new Link(i, i * m));
        }
      }

      /** Receiving an initialized simulated graph from our custom d3 service */
      this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

      /** Binding change detection check on each tick
       * This along with an onPush change detection strategy should enforce checking only when relevant!
       * This improves scripting computation duration in a couple of tests I've made, consistently.
       * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
       */
      this.graph.ticker.subscribe((d) => {
        this.ref.markForCheck();
      });
    });

  }
  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }


}
