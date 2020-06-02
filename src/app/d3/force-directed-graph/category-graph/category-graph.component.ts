import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { D3Service, ForceDirectedGraph } from '../../../d3';
import { ArticleService } from './../../../service/article.service';
import APP_CONFIG from './../../../app.config';
import { Node, Link } from './../../../d3';
import { SUB_OPTIONS } from '../../../shared/data';
import { Subject } from 'src/app/shared/classes';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-category-graph',
  templateUrl: './category-graph.component.html',
  styleUrls: ['./category-graph.component.css']
})
export class CategoryGraphComponent implements OnInit, AfterViewInit {
  nodes: Node[] = [];
  links: Link[] = [];
  graph: ForceDirectedGraph;
  private _options: { width, height } = { width: 800, height: 600 };
  selected_area: Subject;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }


  constructor(
    private d3Service: D3Service,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    const area = this.route.snapshot.paramMap.get('area');
    this.articleService.getCategories(area).subscribe(data => {
      console.log(area);
      console.log(data);
      // this.selected_area = SUB_OPTIONS.find(s => s.area === area);
      // this.selected_area.category = this.selected_area.category.filter(c => c !== 'All subject categories');

      APP_CONFIG.N = data.length;
      const N = APP_CONFIG.N,
        getIndex = number => number - 1;

      if (area == "others") {
        const newNode = new Node(1);
        newNode.name = "others";
        this.nodes.push(newNode);
        //this.nodes[0].linkCount = 20;
      }
      else {
        /** constructing the nodes array */
        for (let i = 0; i < data.length; i++) {
          const newNode = new Node(i);
          newNode.name = data[i];
          this.nodes.push(newNode);
        }

        for (let i = 1; i <= N; i++) {
          for (let m = 2; i * m <= N; m++) {
            /** increasing connections toll on connecting nodes */
            this.nodes[getIndex(i)].linkCount++;
            this.nodes[getIndex(i * m)].linkCount++;

            /** connecting the nodes before starting the simulation */
            //this.links.push(new Link(i, i * m));
          }
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

  goBack(): void {
    this.location.back();
  }
}
