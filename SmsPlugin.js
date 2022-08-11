import React from 'react';
import { IconButton, Badge, ModalPopupWithEntryControl } from '@twilio/flex-ui-core';
import styled from "react-emotion";
import './SmsModal.css'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { notification } from 'antd'
var qs = require('qs');
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Cancel from '@material-ui/icons/Cancel';
import ListItemText from '@material-ui/core/ListItemText';
import { Collapse, Space, Button } from 'antd';
import Popover from '@material-ui/core/Popover';
import ContentEditable from 'react-contenteditable'
const { Panel } = Collapse;

const text1 = {
  color: "black",
  textDecoration: "underline"
};



export const Panelbox = styled("div")`
    width: 260px;
    color: ${(props) => props.theme.calculated.textColor};
    padding: 12px;
    line-height: 20px;
    ${(props) => props.theme.ErrorUI.Panel}`;

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
export default class SmsModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      show1: false,
      sms_value: "",
      phone_number: "",
      cannedarray: [],
      anchor: null,
      showTextbox: false,
      selectedmsg: '',
      isDisabled: false,
      charcount:480,
      maxlen:480

    }
    this.handleMessage = this.handleMessage.bind(this)
  }
  // async componentDidMount(){
  //     let from=this.props.channel.source.attributes.from
  //     let phone_number=from.split(":")[1]
  //     console.log(phone_number,"*****phone_number")

  // }

  handleModal = () => {
    this.setState({ show: !this.state.show })
  }
  handleModal1 = (ev) => {
    console.log("Boolean", Boolean(ev.currentTarget))
    console.log(!!ev.currentTarget)
    console.log("canned Respone" + ev.currentTarget)
    this.setState({ anchor: ev.currentTarget })
  }

  componentDidMount(){
      this.handleCannaedResponses()
  }

  handleCannaedResponses= async ()=> {
      this.setState({show1:!this.state.show1 })

      const body = { WorkerSpaceSid: 'WS0125d10f9b864ef449f5eea82c1e8028' };
      const options = {
        method: 'POST',
        body: new URLSearchParams(body),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
      };
      fetch('https://cannedresponse-3375.twil.io/response', options)
      .then(resp => resp.json())
      .then(data => {
          console.log(data, "datttttttttttt");
          this.setState({ cannedarray: data });
      })
      .catch(err => {
        console.log(err)
      })
  }


  handleMessage = (e) => {
    this.setState({ sms_value: e.target.value })
    console.log(e.target.value)
  }

  escapeRegExp(string) {
    console.log(string, "strrrrrrrrrrrrrrrr")
    return string.replace(/[.*+?^${}<>|[\]\\]/g, '\\$&');
    // $& means the whole matched string

  }

  replacecanned(str, find, replace) {
    console.log(str, "strrrrrrr000")
    return str.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);

  }
  // setSelectedCallingCode(){

  // }
  handleChange = (event) => {
    this.setState({ enableText: true })
    this.setState({ response: event, anchor: null, selectedmsg: event, isDisabled: true });
    console.log(this.state.selectedmsg, "SELECTED MESSAGE ::::::")
    let msg1;
    let msg2;
    if (event.match(/([^[]+(?=]))/g)) {
      var newTxt = event.split('[');
      let sampleText = event;
      for (var i = 1; i < newTxt.length; i++) {
        let value = newTxt[i].split(']')[0];
        console.log(value, "matchhh");

        sampleText = this.replacecanned(sampleText, `[${value}]`, `<span  style="color: red;">[${value}]</span>`);

      }
      this.setState({ selectedmsg: sampleText })
    }
    else {
      this.setState({ selectedmsg: event, isDisabled: false })
    }
    console.log(msg1, "MESSAGE 1 ::::::")
    console.log(msg2, "MESSAGE 2 ::::::")
    console.log(this.state.selectedmsg, "SELECTED MESSAGEE ::::: ")
    // this.setState({ enableContent: true })
  }



sendSms(s_value, phone_number) {
    //console.log(s_value) 
    console.log(this.state.message)
    
var data = qs.stringify({
  'WorkerSpaceSid': 'WS1003379bef66573a71bdb0a94e5ab5b9',
  'Token': this.props.manager.store.getState().flex.session.ssoTokenPayload.token ,
  'content': this.state.selectedmsg,
  'msisdn': '+'+ phone_number
});
// const body = {
//    WorkerSpaceSid: 'WS1003379bef66573a71bdb0a94e5ab5b9' , 
//    Token: this.props.manager.store.getState().flex.session.ssoTokenPayload.token
//   };

var config = {
  method: 'post',
  url: 'https://drab-barracuda-8971.twil.io/Outbound-sms',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data : data
};

axios(config)
.then(response => {
      console.log(response)
      if (response.status === 200) {
        this.openNotification("SMS sent successfully","bottomRight")
        this.setState({
          selectedmsg : "",
          phone_number : "+63",//for philiphines only this needs to be remove if sms will be for countries philiphile as welll.
          charcount : 480
        })
      }
      this.setState({ selectedmsg: '' })
    }).catch(error => {
      console.log(error)
      this.openNotification("Something went wrong..!","bottomRight")
      this.setState({
        selectedmsg : "",
        phone_number : "+63",//for philiphines only this needs to be remove if sms will be for countries philiphile as welll.
        charcount: 480
      })
    
    })
  }
  openNotification = (description, placement) => {
    notification.info({
      description: description,
      placement,
    });
  };

  handleChangeText = (ev) => {
    console.log(ev.target.value, "EVENT :::: ");
    console.log(ev, "EVENT :::: ");
    if(ev.target.value.length <= this.state.maxlen)
    {
      this.setState({ selectedmsg: ev.target.value })
    }

    //this.setState({ selectedmsg: ev.target.value })
    // if (ev.target.value.match(/([^[]+(?=]))/g) || ev.target.value.match(/\[/) || ev.target.value.match(/\]/) ){
    //   this.setState({ isDisabled: true, selectedmsg: ev.target.value })
    // }
    // else if (ev.target.value ==null||ev.target.value === '') {
    //   //make is disabled false 
    //   this.setState({ isDisabled: true, enablecontent: true,showTextbox:false })
    // }
    // else {
    //   this.setState({ isDisabled: false, selectedmsg: ev.target.value })
    // }
  }
  countHandler=(e)=>{
    if(e.target.value.length <= this.state.maxlen)
    {
      var lencount=e.target.value.length;
      var max_len=this.state.maxlen;
      var result=max_len-lencount;
      console.log(lencount,result)
      this.setState({
        charcount:result
      })
      if(result<=0){
        document.getElementById("head").style.color="red"
        this.setState({
          isDisabled :true
        })
      } 
    }

    else{
      document.getElementById("head").style.color="blue"
      this.setState({
        isDisabled :false
      })

    }
  }

  render() {
    console.log(this.state, "PHONE:::::::::::::::::")
    return (
      <div>
        <ModalPopupWithEntryControl alignRight entryControl={this.renderTriggerButton} >
          {/* <ClickAwayListener onClickAway={this.renderTriggerButton}> */}
          <Panelbox className="alertbox">
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              {/* <Button 
                 onClick={() => this.handleModal()}
                 style={{fontSize: 13,letterSpacing:1,width:'95%',margin:10}}
                 size='sm'
                 >Outbound SMS</Button>
                 <Modal  show={this.state.show} onHide={() => this.handleModal()}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body> */}



              {/* <textarea 
                          rows='2'
                          placeholder="Type Message"
                          value={this.state.message} 
                          onChange = {(e)=>this.handleMessage(e)} 
                          // style={{width:}}
                         /> */}
              <h5 style={{ marginTop: '10px', marginBottom: '40px' }}><b>Outbound SMS</b></h5>


              <PhoneInput style={{ textAlign: 'center', marginBottom: "20px", textAlign: "centre" }}
                country={'ph'}
                value={this.state.phone_number}
                onChange={phone_number => this.setState({ phone_number })}
              />
            
            {/* <textarea
            value={this.state.selectedmsg}
            style={{ border: "1px solid rgb(35, 54, 89)", padding: "10px", whiteSpace: "pre-wrap", height: 150, overflowY: "scroll", width: '100%', background: 'white' }}
             onChange={(event)=>{
              this.handleChangeText(event); this.countHandler(event)
            }}/> */}

              <ContentEditable
                id="contentData"
                onKeyPress={event => {
                  if (event.key === 'Enter') {
                    document.execCommand('insertLineBreak')
                    event.preventDefault();
                  }
                }}
                onKeyDown={event => {
                  if (event.key === 'Backspace') {
                    onfocus = "document.execCommand('selectAll');"
                  }
                }}
                style={{ border: "1px solid rgb(35, 54, 89)", padding: "10px", whiteSpace: "pre-wrap", height: 150, overflowY: "scroll", width: '100%', background: 'white' }}
                html={this.state.selectedmsg}
                onChange={(event)=>{this.handleChangeText(event); this.countHandler(event)}}// handle innerHTML change
              />


 <div id="head" 
              style={{color:"blue",marginLeft:"300px",fontFamily:"italic"}}>
                {this.state.charcount}/480 characters remaining
              </div> 
              <br />



              <Button
                         className="btn" value={this.state.cannedarray} onClick={(event) => this.handleModal1(event)}
                         style={{fontSize:13,letterSpacing:1,background: 'rgb(35, 54, 89)',color:'white',borderRadius:'20px'}}
                        >
                            CANNED RESPONSE
                        </Button>
                        <br />
              <Button
                onClick={() => this.sendSms(this.state.sms_value, this.state.phone_number)}
                disabled={this.state.isDisabled}
                style={{ fontSize: 13, letterSpacing: 1, background: 'rgb(35, 54, 89)', color: 'white', marginLeft: '19px', borderRadius: '20px', height: '35px' }}

              >

                SEND
              </Button>


              {/* </Modal.Body> */}

               <Popover PaperProps={{ style: { width: '80%', height: '90%', border: "1px solid black" } }} anchorEl={this.state.anchor} open={Boolean(this.state.anchor)}>
                           <List component="nav">
                            <ListItem style={{ display: 'flex', justifyContent: 'flex-end' }} >
                              <ListItemIcon onClick={() => this.setState({ anchor: null ,showTextbox:false})}>
                                <Cancel></Cancel>
                              </ListItemIcon>
                            </ListItem>
                            <Space
                              direction="vertical"
                              size="middle"
                              style={{
                                // display: 'flex',
                                margin:10,
                                width:"100%"

                              }}
                            >
                              <Collapse style={{width:"100%"}}>
                            {
                              this.state.cannedarray.map((c, i) => {
                                return (
                                
                                  
                                    
                                      <Panel  style={{ fontWeight: 600 ,fontSize:17,fontDecorationLine:'underline'}} header={c.subtopics[0].topic} >
                                        <ListItem  
                                        style={{ marginTop: '10px', whiteSpace: "pre-wrap" }} 
                                        button
                                        onClick={this.handleChange.bind(this, c.subtopics[0].topicdata)}>
                                          <ListItemText style={{ whiteSpace: "pre-wrap" }}> {c.subtopics[0].topicdata}
                                            {/* <div  style={{fontSize:'15px'}} dangerouslySetInnerHTML={{
                                              __html: c.subtopics[0].topicdata
                                            }}></div> */}
               </ListItemText>
                                        </ListItem>
                                        {c.subtopics?.slice(1).map((o, i) => {
                                          return (
                                            <>
                                              <ListItem>
                                                <ListItemText 
                                                  primaryTypographyProps={{ style: text1 }}
                                                >
                                                  {o.heading}
                                                </ListItemText>{" "}
                                              </ListItem>
                                              <ListItem
                                                button
                                                onClick={this.handleChange.bind(this, o.data)}
                                              >
                                                <ListItemText>
                                                  <p  style={{fontSize:15 }}>{o.data}</p>{" "}
                                                </ListItemText>
                                              </ListItem>
                                            </>
                                          );
                                        })}
                                    
                                      </Panel>
                                    
                              );
                          })}
                          </Collapse>
                        </Space>
                      </List>
                     </Popover> 
              {/* </Modal> */}
            </div>
          </Panelbox>
          {/* </ClickAwayListener> */}
        </ModalPopupWithEntryControl>
        <Badge children="test" themeOverride={{ OuterCircle: { position: "relative", top: "-33px", right: "-14px", width: "1px" } }} />
      </div>
    )
  }
  renderTriggerButton = (isModalOpen) => {
    return (
      <div>
        <IconButton style={{ marginTop: '19px' }} icon="Message" >
          <StyledBadge color="secondary"></StyledBadge>
        </IconButton>
      </div>
    );
  };
}
