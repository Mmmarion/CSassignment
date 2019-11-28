import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError, max } from "rxjs/operators";
import { RequestData } from "../shared/request-data";
import { UserData } from "../shared/user-data";
import { EmailData } from "./email-data";

@Injectable({
  providedIn: "root"
})
export class RestApiService {
  apiURL = "http://localhost:3000";

  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  getRequestsData(): Observable<RequestData> {
    return this.http
      .get<RequestData>(this.apiURL + "/requests")
      .pipe(retry(1), catchError(this.handleError));
  }

  getRequestData(id: number): Observable<RequestData> {
    return this.http
      .get<RequestData>(this.apiURL + "/requests?Id=" + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getAllUserData(): Observable<UserData[]> {
    return this.http
      .get<UserData[]>(this.apiURL + "/Users")
      .pipe(retry(1), catchError(this.handleError));
  }

  getUserData(id): Observable<UserData> {
    return this.http
      .get<UserData>(this.apiURL + "/Users?Id=" + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  getUserDataForEmail(idRequestor, idStoryteller): Observable<UserData[]> {
    return this.http
      .get<UserData[]>(
        this.apiURL + "/Users?Id=" + idRequestor + "&Id=" + idStoryteller
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  getMaxRequestId(): Observable<RequestData> {
    return this.http
      .get<RequestData>(this.apiURL + "/requests?_sort=Id&_order=desc")
      .pipe(retry(1), catchError(this.handleError));
  }

  createRequestData(requestData): Observable<RequestData> {
    return this.http
      .post<RequestData>(
        this.apiURL + "/requests",
        JSON.stringify(requestData),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  updateRequestData(id, requestData): Observable<RequestData> {
    return this.http
      .put<RequestData>(
        this.apiURL + "/requests/" + id,
        JSON.stringify(requestData),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  sendEmail(emailData: EmailData): Observable<EmailData> {
    return this.http
      .post<EmailData>(
        this.apiURL + "/emails/",
        JSON.stringify(emailData),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
