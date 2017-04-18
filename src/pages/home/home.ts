import { Component, NgZone, ViewChild  } from '@angular/core';
import { Platform, ToastController  } from 'ionic-angular';
import { NavController, Content } from 'ionic-angular';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Http, Headers, RequestOptions } from '@angular/http';

//declare var SpeechRecognition: any;
declare var platform: any;
declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  recognition: any;
  ready: boolean = false;
  isWaiting: boolean = false;
  errorCordova : string = "No error";
  public statusSpeaker : string;
  public resultText : string;
  public isRecognizing : boolean = false;
  public isSpeaking : boolean = false;
  public spokenWords : Array<string> = new Array<string>();
  public messages: any[];
  public isLoggedIn : boolean = false;
  public texting : string;
  @ViewChild(Content) content: Content;

  counter : number = 0;



  constructor(public navCtrl: NavController, platform: Platform, public  _zone: NgZone, public toastCtrl: ToastController, private tts: TextToSpeech, private http: Http  ) {
    platform = platform;
    this.messages = [];


    platform.ready().then(() => {
      this.ready = true;
      if(this.isLoggedIn){
        this.AppStart();
      }
      else
      {
        this.tts.speak("Please say secret phrase").then(() => {
            this.AppStart();
          }
        ).catch();
      }
    });
  }

  AppStart(){
    if(window.SpeechRecognition)
    {
        this.recognition = new window.SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.lang = 'en-IN';
        this.recognition.maxAlternatives = 3;
        this.recognition.onnomatch = (event => {
            console.log('No match found.');
        });
        this.recognition.onstart = (event => {
            console.log('Started recognition.');
            this._zone.run(() => {
                this.isRecognizing = true;
                this.isWaiting = false;
            }
            )
        });

        this.recognition.onend = (event => {
            console.log('Stopped recognition.');
            this._zone.run(() => {
                this.isRecognizing = false;
                //this.presentToast("Stopped recognition.")
                this.isWaiting = false;
            })
        });

        this.recognition.onerror = (event => {
            console.log('Error...' + event.error);
            this._zone.run(() => {
                this.errorCordova = 'Error'
                this.isRecognizing = false;
                //this.presentToast("Error..." + event.error)
                this.isWaiting = false;
            }
            )
        });

        this.recognition.onresult = (event => {
                if (event.results) {
                      this._zone.run(() => {
                          var result = event.results[0];
                          if(this.isLoggedIn){
                            this.resultText = 'Last Text added : \n' + result[0].transcript;
                            this.spokenWords.push(result[0].transcript);
                            this.AppendText("User",result[0].transcript);
                            this.SendToAPIAI(result[0].transcript);
                            console.log('Text: ' + result[0].transcript);
                            //this.presentToast(this.resultText);
                          }
                          else{
                            if(result[0].transcript==="morning"){
                              this.isLoggedIn = true;
                              this.ToSpeech("Welcome to I C I C I Voice");

                              this.SendToAPIAI("fetch alert");
                            }
                            else{
                              this.ToSpeech("You have not yet authenticated, please tell me your secret phrase");
                            }
                          }
                  }
              )
              this.isWaiting = false;
              this.isRecognizing = false;
            }
        });
    }
  }

  AppendText(username, textresult){
    var result = {user: username, text: textresult};
    this.messages.push(result);
    this.scrollToBottom();
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      position : "middle",
      duration: 3000
    });
    toast.present();
  }


  SpeechToText(){
    this.ToSpeech("");
    this.statusSpeaker = 'Waiting...';

    if(!this.isRecognizing)
    {
        this.recognition.start();
        this.isWaiting = true;
    }
    else
    {
        this.isWaiting = true;
    }


  }
   ToSpeech(texttotalk){
    try{
//      this.presentToast("Welcome");
        this.tts.speak(texttotalk).then().catch();
//      this.presentToast("Spoken Words");
    }catch(e)
    {
//      this.presentToast(e);
    }


    }

    SendToAPIAI(sendtoAPI){
      var accessToken = "Bearer 198a8c8d573b4ae0831a8ede85e6436d";
      var URL =  "https://api.api.ai/v1/query?v=20150910";
      var header= new Headers({'Content-Type':'application/json', Authorization: accessToken});
      var options= new RequestOptions({headers:header});
      var returndata;
      var data =JSON.stringify({query:sendtoAPI, lang:'en', sessionId: 'MyApp'});
      this.http.post(URL,data,options)
        .subscribe(response => {
          this.spokenWords.push(response.json().result.fulfillment.speech);
          returndata = response.json().result.fulfillment.speech;
          this.AppendText("App",returndata);
          this.ToSpeech(response.json().result.fulfillment.speech);
        }, error => {
          this.AppendText("App","Unable to reach banking service, please check your internet connection");
          this.ToSpeech("Unable to reach banking service, please check your internet connection");
          //this.presentToast("Error sending to APIAI");
        });

    }
    Send(textedquery){
      this.AppendText("User",textedquery);
      this.texting = "";
      this.SendToAPIAI(textedquery);
    }
    scrollToBottom(){
      this.content.scrollToBottom();
    }



}
