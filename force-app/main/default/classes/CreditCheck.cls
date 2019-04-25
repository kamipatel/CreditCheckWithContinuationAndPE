public with sharing class CreditCheck {
  
@AuraEnabled(continuation=true)
public static Object startCreditCheckRequest(){

    HttpRequest req = new HttpRequest();
    req.setEndpoint('https://labappdeploy.herokuapp.com/CreditScore');
    req.setMethod('GET');
     
    Continuation con = new Continuation(60);
    con.state = con.addHttpRequest(req);
    con.continuationMethod = 'callback';       

    // Return it to the system for processing
    return con;
}

@AuraEnabled(cacheable=true)
public static Object callback(Object state) {
        HttpResponse response = Continuation.getResponse((String)state);
        Integer statusCode = response.getStatusCode();
        if (statusCode >= 2000) {
            return 'Continuation error: ' + statusCode;
        }
        return response.getBody();
    }


}