import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, FormGroup, FormBuilder } from "@angular/forms";
import { RestApiService } from "../shared/rest-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UserData } from "../shared/user-data";
import { RequestData } from "../shared/request-data";
import { EmailData } from "../shared/email-data";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"]
})
export class FormComponent implements OnInit {
  constructor(
    private restApi: RestApiService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  @ViewChild("f", { static: false }) requestForm: NgForm;
  goodEndings = ["Yes", "Depends", "No"];
  needStoryTeller = false;
  wantedCharacters = [
    "charA",
    "charD",
    "charFGKS",
    "charSRMH",
    "charRMWU",
    "charMZJM",
    "charQNKT",
    "charJVCM",
    "charMRMS",
    "charQOPV",
    "charFEBI",
    "charERET",
    "charWURO",
    "charVDVS",
    "charRUFK",
    "charWOYF",
    "charLSDE",
    "charRSUQ",
    "charDLLL",
    "charPEEB",
    "charXSQF",
    "charKPUS",
    "charNONK",
    "charIHRW",
    "charGFVI",
    "charSPTE",
    "charBIBH",
    "charDDGH",
    "charENDB",
    "charKMDF",
    "charZXWX",
    "charAOTP",
    "charRYOD",
    "charAKDT",
    "charBNKM",
    "charWEXG",
    "charZOOM",
    "charKCXL",
    "charVTKK",
    "charWPGS",
    "charZCDE",
    "charRUSX",
    "charWTIF",
    "charGYQN",
    "charLMMF",
    "charAGMF",
    "charZBDG",
    "charIVNE",
    "charPMCV",
    "charNNRC",
    "charGOXI",
    "charKVLC",
    "charBWPY",
    "charGEIO",
    "charABRG",
    "charTCFL",
    "charJOJW",
    "charLKQN",
    "charBRJA",
    "charTPBS",
    "charUOGA",
    "charMPQT",
    "charEAJM",
    "charPTWT",
    "charVHTV",
    "charPRPT",
    "charBYLT",
    "charJBIK",
    "charHLOM",
    "charGUEC",
    "charYCAR",
    "charQKBI",
    "charXLCX",
    "charHEES",
    "charGDJQ",
    "charEJHL",
    "charRKFV",
    "charDMVK",
    "charVTXJ",
    "charKLRY",
    "charELSE",
    "charIQJO",
    "charSUKQ",
    "charHXFJ",
    "charIFVL",
    "charUCEI",
    "charCXHH",
    "charIQHG",
    "charMPWN",
    "charLLAZ",
    "charJABB",
    "charOCUP",
    "charPGSI",
    "charHUXA",
    "charHSGZ",
    "charEEXM",
    "charXULM",
    "charLEYS",
    "charJEBS",
    "charYPWD"
  ];
  requestData: any = {};
  userData: any = {};
  canEdit = true;

  submitButtonText = "Submit";

  dDate = new Date();
  wAhead = new Date();
  cYear = new Date().getFullYear();
  defaultDate: string;
  weekAhead: string;
  currentYear: string;

  id: number;
  allUsers: UserData[];

  wantedCharactersAll: { [key: string]: Object }[] = [];
  localFields: Object = { text: "Name", value: "Code" };
  localWaterMark: string = "Select wanted characters";

  ngOnInit() {
    this.id = this.route.snapshot.params["id"];

    for (var i = 0; i < this.wantedCharacters.length; i++) {
      this.wantedCharactersAll.push({
        Name: this.wantedCharacters[i],
        Code: this.wantedCharacters[i]
      });
    }

    if (this.id) {
      this.restApi.getRequestData(this.id).subscribe((data: {}) => {
        let response: RequestData = data[0];
        this.requestForm.form.patchValue({
          requestName: response.RequestName,
          requestor: response.Requestor,
          goodEnding: response.GoodEnding,
          description: response.Description,
          needStoryTeller: response.NeedStoryteller,
          storyteller: response.Storyteller,
          wanted: response.WantedCharacters
            ? response.WantedCharacters.split(";")
            : "",
          deadline: new Date(response.Deadline).toISOString().split("T")[0],
          budget: response.Budget,
          status: response.Status
        });

        this.restApi.getUserData(response.Requestor).subscribe((data: {}) => {
          this.userData = data[0];
          if (this.userData) {
            const roles: string[] = this.userData.Roles;
            this.canEdit = roles.includes("Owner");
            if (this.canEdit) {
              this.submitButtonText = "Update";
            }
          } else {
            this.canEdit = false;
          }
        });
      });
    }

    this.dDate.setDate(this.dDate.getDate() + 28);
    this.defaultDate = this.dDate.toISOString().split("T")[0];

    this.wAhead.setDate(this.wAhead.getDate() + 7);
    this.weekAhead = this.wAhead.toISOString().split("T")[0];

    this.currentYear = `${this.cYear}-12-31`;

    this.restApi.getAllUserData().subscribe((data: UserData[]) => {
      this.allUsers = data;
    });
  }

  onSubmit() {
    this.submitFormWithStatus("New");
  }
  onCancle() {
    this.requestForm.reset();
    this.router.navigate(["/dashboard"]);
  }

  onSave() {
    this.submitFormWithStatus("Draft");
  }

  submitFormWithStatus(status) {
    if (this.id) {
      this.submitForm(this.id, status, "U");
    } else {
      this.restApi.getMaxRequestId().subscribe((data: {}) => {
        let maxId: number = parseInt(data[0].Id) + 1;
        this.submitForm(maxId, status, "C");
      });
    }
  }

  submitForm(id, status, operation) {
    let newRequest = new RequestData();

    newRequest.Id = id;
    newRequest.RequestName = this.requestForm.value.requestName;
    newRequest.Requestor = this.requestForm.value.requestor;
    newRequest.GoodEnding = this.requestForm.value.goodEnding;
    newRequest.Description = this.requestForm.value.description;
    newRequest.NeedStoryteller = this.requestForm.value.needStoryTeller;
    newRequest.Storyteller = this.requestForm.value.storyteller || "";
    let charsString;
    if (this.requestForm.value.wanted) {
      charsString = this.requestForm.value.wanted.join(";");
    }
    newRequest.WantedCharacters = charsString;
    let deadlineInTimeStamp = new Date(
      this.requestForm.value.deadline
    ).getTime();
    newRequest.Deadline = deadlineInTimeStamp;
    newRequest.Budget = this.requestForm.value.budget;
    newRequest.Status = status;

    if (operation == "U") {
      this.updateRequest(id, newRequest);
    } else {
      this.addRequest(newRequest);
    }

    if (newRequest.Requestor) {
      var storyTellerId: any = "";
      if (newRequest.Storyteller) {
        storyTellerId = parseInt(newRequest.Storyteller);
      }
      this.restApi
        .getUserDataForEmail(parseInt(newRequest.Requestor), storyTellerId)
        .subscribe(data => {
          let sendTo: string[];
          if (data.length > 1) {
            sendTo = [data[0].Email, data[1].Email];
          } else if (data.length == 1) {
            sendTo = [data[0].Email];
          }
          let emailData = new EmailData(
            "New request",
            "Hi, A new request has been created by " +
              newRequest.Requestor +
              " Cheers, Story Team",
            sendTo
          );
          this.restApi.sendEmail(emailData).subscribe((data: {}) => {});
        });
    }

    this.requestForm.reset();
    this.router.navigate(["/dashboard"]);
  }

  addRequest(reguestData) {
    this.restApi.createRequestData(reguestData).subscribe((data: {}) => {});
  }

  updateRequest(id, requestData) {
    this.restApi.updateRequestData(id, requestData).subscribe((data: {}) => {});
  }
}
