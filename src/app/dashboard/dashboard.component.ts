import { Component, OnInit, AfterViewInit, Renderer2 } from "@angular/core";
import { RestApiService } from "../shared/rest-api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { RequestData } from "../shared/request-data";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  requestsData: RequestData[] = [];

  columns = [
    "Id",
    "RequestName",
    "Requestor",
    "GoodEnding",
    "Description",
    "NeedStoryteller",
    "Storyteller",
    "WantedChar",
    "Deadline",
    "Budget",
    "Status"
  ];

  constructor(
    public restApi: RestApiService,
    public router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private render: Renderer2
  ) {}

  ngOnInit() {
    const that = this;

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: (dataTablesParameters: any, callback) => {
        var url = this.configureTableRequestParam(dataTablesParameters);

        dataTablesParameters["observe"] = "response";
        that.http
          .get<any>(url, dataTablesParameters)
          .subscribe((resp: HttpResponse<any>) => {
            that.requestsData = resp.body;
            let totalCount = resp.headers.get("X-Total-Count");

            callback({
              recordsTotal: this.requestsData.length,
              recordsFiltered: totalCount,
              data: []
            });
          });
      }
    };
  }

  formatDate(timestamp) {
    return new Date(timestamp).toISOString().split("T")[0];
  }

  checkLengthTruncate(text: string, limit: number): string {
    if (text) {
      if (text.length > limit) {
        //let shortenText =
        // text
        //   .substring(0, limit)
        //   .split(" ")
        //   .slice(0, -1)
        //   .join(" ") + "...";
        let shortenText = text.substring(0, limit - 3) + "...";
        return shortenText;
      } else {
        return text;
      }
    }
  }

  configureTableRequestParam(dataTablesParameters): string {
    let url = this.restApi.apiURL + "/Requests";
    let limit = dataTablesParameters.length;
    if (!limit) {
      limit = 10;
    }
    url += "?_limit=" + limit;

    let searchTerm = dataTablesParameters.search.value;
    if (searchTerm) {
      url += "&q=" + searchTerm;
    }

    let sort = dataTablesParameters.order;
    if (sort.length > 0 && sort[0]) {
      url += "&_sort=" + this.columns[sort[0].column];
      url += "&_order=" + sort[0].dir;
    }

    let start = dataTablesParameters.start;
    url += "&_start=" + start;

    return url;
  }
}
