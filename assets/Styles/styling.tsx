import dashboard from "@/app/(User)/Dashboard";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
const {width} = Dimensions.get('screen');
    const sidebarheaderwidth = width * 0.7;

    const {height} = Dimensions.get('screen');
    const sidebarheaderheight = height * 0.3;
    const sidebarbodyheight = height *0.7;
    const featureimagewidth = width*0.45;
    const featureimagebotwidth = width * 0.93;
    const featureimagebotheight = height * 0.15;
    const featureimageheight = height*0.2;
    const closeviewheight= height *0.8;
    const chatContainerwidth = width *0.5;
    const sidebarbarbodywidth=width*0.5;
    const widthcont = width*0.9;
    const heightcont = height*0.5;
    // const paymentcardwidth = width*0.8

const styling = StyleSheet.create({
    
    container: {
        flex: 1, justifyContent: "center", alignItems: "center"
    },
    intro1container: { flex: 1, alignItems: 'center', paddingVertical: 90 },
    intro2container: { flex: 1, alignItems: 'center', paddingVertical: 100 },
    intro3container: { flex: 1, alignItems: 'center', paddingVertical: 60 },
    DotsContainer: { flex: 1, flexDirection: 'row', gap: 10 },
    MarkDot: { color: '#2ECC71', fontSize: 60 },
    SimpleDot: { color: '#cccccc', fontSize: 60 },
    subcontainer: {

        // marginTop: 100,
        // paddingTop:20,
        paddingTop: 10,
        paddingHorizontal: 10,
        // paddingBottom:10,
        gap: 5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#2ecc71',
        borderRadius: 10
    },
    Signupsubcontainer: {
        // position:'absolute',
        marginTop: 50,
        // paddingTop:20,
        paddingTop: 5,
        paddingHorizontal: 10,
        paddingBottom:10,
        gap: 5,
        // justifyContent:'flex-start',
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#2ecc71',
        borderRadius: 10,
        // height:540
    },
    WelcomeContainer:{ 
        flex:1,
        paddingHorizontal:30,
        justifyContent:"center",
        alignItems:"center",
        // borderWidth:1,
        // borderColor:'#2ecc71'     
      },
      Welcomesubcontainer:{
        position:'static',
        marginTop:50,
        paddingTop:20,
        paddingBottom:40,
        paddingHorizontal:10,
        gap: 15,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
        borderColor:'#2ecc71',
        borderRadius:10 
      },
      Link1: { color: '#2ecc71', alignSelf: 'flex-end' },
      Link2: { paddingBottom: 5 ,color:'#2ecc71'},
      Link3: { color: "#2ecc71" },
      CenterLink:{
        color:'#2ecc71', alignSelf:'center'
      },
      Link3Text: { textDecorationLine: 'underline' ,color:'#2ecc71'},
      signupimg: { height: 57, width: 80 },
      loginimg: { height: 130, width: 170 },
      Indeximg: { height: 400, width: 400 },
      IndexView: { height: 70, marginTop: 30 },
    placeholder: {
      backgroundColor: "white",
      width: 300,
      borderWidth: 1,
      borderRadius: 10, padding: 2, paddingHorizontal: 5
    },
    PlaceHolderView: { alignItems: 'flex-start', gap: 5 },
    inputContainer: {
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2ecc71',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 0,
        marginBottom: 10,
      },flexdirectionrow:{
flexDirection:'row'
      },
      textInput: {
        flex: 1,
        // paddingVertical: 5,
        fontSize: 15,}
        ,FullWidthbutton:{
          
          backgroundColor:"#2ECC71",paddingHorizontal:20, paddingVertical: 5, borderRadius:10,width:300,alignItems:'center'
        },
        FullwidthbtnText:{
          fontSize:20, color: "#CCCCCC", fontWeight:"bold"
        },
        FullwidthWhitebtn:{
          paddingHorizontal:20, paddingVertical: 5, borderRadius:10,width:300,alignItems:'center', borderWidth:2,borderColor:'#2ecc71'
        },
        whitebtntext:{
          fontSize:20, color: "#2ecc71", fontWeight:"bold"
        },Nextbutton:{
          paddingVertical:2,
          paddingHorizontal: 30
          
        },
        NextBackbtntext:{
        fontSize:30, color: "#2ECC71", fontWeight:"bold"
    },
    button:{},
    whitetextheading:{
      fontSize: 30,fontWeight:'bold', color:'white'
    },
    NextBackbtnimage:{height:35,width:20},
    Gap:{gap:10},
    Backbtn:{flex:1,flexDirection:'row',gap:10,alignItems:'flex-start',height:40,justifyContent:'center',position:'absolute',top:30,left:20},
    Nextbtn: { alignSelf: 'flex-end', position: 'absolute', bottom: 30, right: 20, backgroundColor: '#2ECC71', borderRadius: 30 },
    freetrialbtn:{
        backgroundColor:'white',paddingHorizontal:20, paddingVertical: 5, borderRadius:10,width:300,alignItems:'center'
      },
      FreeTrialText:{
        color:'#2ecc71' ,fontSize:20,fontWeight:'bold'     },
        TextwithColor: { fontWeight: 'bold', color: '#2ecc71', fontSize: 30 },
        none:{},
        icon: {
          marginLeft: 8,
        },
        CenterItem:{alignItems:'center'},
        Boldfont:{fontWeight:'bold'},
        whitetextparagraph:{
          color:'white',textAlign: 'center', fontSize: 15, paddingHorizontal: 10 
        },
        
        HeaderText: { fontSize: 25, fontWeight: 'bold' },
        Heading: { fontSize: 30, fontWeight: 'bold' },
        Headinglong:{fontSize:30, fontWeight:'bold', textAlign:'center'},
        Paragraph: { textAlign: 'center', fontSize: 15, paddingHorizontal: 10 }
        ,
    // styling.js
    marginright:{
    //  right:10
    },




                                  //Dashboard
    subcontainerfornavbar:{
        flexDirection: 'row', // Align items horizontally
        justifyContent: 'space-between', // Space between sidebar name and logo
        alignItems: 'center', // Align them vertically in the center
        paddingHorizontal: 10,height:40,
    },
    navbarleftside:{
        flexDirection:'row',
        columnGap:10
    }
    ,
    sidebarContainer: {
        zIndex:1,
        position: 'absolute',
        top: 0,
        left: 0,height:height,
        width: sidebarheaderwidth,
        // height: verticalScale(700),
        backgroundColor: '#fff',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      closeButton: {
        // position: 'absolute',right:20,
        // top: 100,
        // right: 100,
        // // zIndex:1,
        position: 'absolute',right:20,
        backgroundColor: '#2ecc71',

        // zIndex:1,
        // borderRadius:7,
        borderBottomLeftRadius:7,
        borderTopLeftRadius:7,
        width: 30,
        height: 70,
        justifyContent:'center',
        alignItems: 'center',
      },
      closeText: {
        zIndex:1,
        fontSize: 18,color:'#CCCCCC',
        fontWeight: 'bold',
      },closebuttonview:{
        zIndex:1,
        borderRadius: 15,
        width: sidebarheaderwidth,
        height: closeviewheight,
        justifyContent:'center',
        alignItems: 'flex-end',
        // justifyContent:'center',
      },
      sidebarHeader: {
        position:'absolute',
        backgroundColor:'#2ecc71',
        width:sidebarheaderwidth,
        borderBottomLeftRadius:15,
        borderBottomRightRadius:15,

        // height: verticalScale(200),
        height:sidebarheaderheight,
        justifyContent:'center',
        alignItems:'center'
      },
      sidebarOption: {
        fontSize: 16,
        marginVertical: 10,
      },
      dashboardimageview:{
        // marginHorizontal:10
      },
dashboardimage:{
    height:200, justifyContent:'center', padding:15
}
    ,DashboardHeading:{
        fontSize: 30, fontWeight: 'bold',color:'white'
    }
,dashbaordfeaturesmainview:{
    marginVertical:10,gap:10,
alignItems:'center'
}
,
dashbaordfooter:{
position:'absolute',rowGap:15,
width:width,
bottom:80, flexDirection: 'row', // Align items horizontally
justifyContent:'space-between', // Space between sidebar name and logo
alignItems: 'center', // Align them vertically in the center
paddingHorizontal: 20,height:50,
},
dashboardbtnimages:{height:35,width:30},dashboardfooterbtnimages:{height:35,width:30,marginTop:10},selectedButton: {
    // backgroundColor: 'blue',
    color:'#2ecc71',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button1: {
    // backgroundColor: 'gray',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureheading:{fontSize: 30, fontWeight: 'bold',paddingHorizontal:10,marginTop:30},
  featureimage:{
    height:featureimageheight,width:featureimagewidth,borderRadius:10
  },featurebotimage:{
    // height:featureimageheight,width:featureimagebotwidth,borderRadius:10
    height:featureimagebotheight,width:featureimagebotwidth,borderRadius:10

  },featuresubview:{
    flexDirection:'row',
    gap:10
  },backbtnimagenavbar:{
    height:30,width:20,color:'white'
  },sidebarHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  sidebarUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  sidebarUserEmail: {
    fontSize: 14,
    color: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sidebarbody:{
    width:sidebarbarbodywidth,
    height:sidebarbodyheight,position:'absolute',top:sidebarheaderheight,padding:30,rowGap:10,zIndex:1
  }
  ,
  sidebarbodysubview:{ flexDirection:'row',gap:10,alignItems:'center',},
  sidebarbtn:{
    width: 120,height:30,color:'black',fontSize:16,fontWeight:'bold',justifyContent:'center'
  }, line: {
    height: 1, // Line thickness
    backgroundColor: '#2ecc71', // Line color
    marginVertical: 10, // Spacing around the line
    width: '100%', // Full width
  },sidebaricons:{
    width:20,height:20
  },userProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Circular image
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  
  
                                //ChatBot
  
  
  ChatBotHeadercontainer:{flex:1,flexDirection:'row',gap:10,alignItems:'flex-start',height:40,position:'absolute',top:30,zIndex:1,width:width,paddingHorizontal:10,backgroundColor:'#2ecc71',},
  ChatbotHeader:{
    width:40,height:40
  },// Add these styles in your styling file (styling.ts)
  chatContainer: {
    // flex: 1,
    position:'absolute',
    bottom:10,
    // flexDirection:'row',
    // paddingHorizontal: 20,
    marginTop: 30,
    
  },
  chatInput: {
    // width:chatContainerwidth,
    height: 60,
    // paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    justifyContent:'center',alignItems:'center',
    backgroundColor: '#2ecc71',
    // paddingVertical: 10,
    width:40,height:40,marginBottom:10,
    // paddingHorizontal: 40,
    borderRadius: 20,
  },
  submitButtonText: {
    zIndex:1,
    color: '#CCCCCC',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
   inputAndButtonContainer: {
    flexDirection: 'row',gap : 5,
    // padding: 10,
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
    // backgroundColor: '#fff',
    // alignItems: 'center',height:60,
    justifyContent:'center',
    paddingTop:5
  },
  userMessage: {
    alignSelf: 'flex-end', 
    backgroundColor: '#2ecc71', 
    padding: 10, 
    borderRadius: 10, 
    marginVertical: 5,
  },
  botMessage: {
    alignSelf: 'flex-start', 
    backgroundColor: '#f1f1f1',borderWidth:1,borderColor:'#2ecc71', 
    padding: 10, 
    borderRadius: 10, 
    marginVertical: 5,
  },
  chatMessageText: {
    fontSize: 16,
    color: '#333',
  },
  chatHistoryContainer: {
    padding: 10,
    // position:'relative'
    marginTop:30,
    paddingBottom:25
  },chatsendmessageimage:{
    height:20,width:20
  },timestampText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },timestampContainer: {
    marginTop: 5,  // Adds some space between the message and timestamp
    alignSelf: 'flex-end', // Aligns the timestamp to the left, or adjust based on your layout
  },centeredDate: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -100 }], // Adjust to center the text
    zIndex: 1,
  },
  
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  systemMessage: {
    backgroundColor: '#f0f0f0', // Light gray background
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: 'center',
  },  introScreenContainer: {
    flex: 1,paddingTop:60,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',height:height,width:width,
  },
  introImage: {
    width: 200,
    height: 170,
    // marginBottom: 20,
  },
  introText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  dateLabelText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },faqText: {
    fontSize: 16,
    color: 'white',
    marginVertical: 10,justifyContent:'center',paddingTop:3,paddingHorizontal:2,
    textAlign: 'center',width:'auto',height:30,
    borderRadius:10,borderWidth:1,borderColor:'#2ecc71',backgroundColor:'#2ecc71'
  },Faqcontainer:{
    width:width,alignItems:'center',justifyContent:'center',
    height:100,gap:5,
    flexDirection:'row',
    flexWrap:'wrap'
  },inputbuttonContainer:{
    position:'absolute',
    bottom:0, flexDirection: 'row',gap : 5,
  },selectedMessage: {
    backgroundColor: '#f5f5f5',
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectButton: {
    // padding: 10,
    // backgroundColor: '#e0e0e0',
    // borderRadius: 5,
  },
  selectButtonText: {
    // color: '#007bff',
    // fontSize: 14,
  },


  paymentcardview:{
    width:width*0.94,height:height*0.3,marginHorizontal:10
  },
  paymentcard:{
    // resizeMode:'cover'
  },viewpayment:{
    width:width,height:height
  }, subcontainercontact: {
    width:widthcont,height: heightcont,

    // marginTop: 100,
    // paddingTop:20,
    paddingTop: 0,
    paddingHorizontal: 10,
    // paddingBottom:10,
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 10
},

contactbtn:{
  position:'absolute',left:0,bottom:42,zIndex:1,width:sidebarheaderwidth,height:40,backgroundColor:'#2ecc71',justifyContent:'center',alignItems:'center'
},contactbtntext:{
  color:'white',fontWeight:'bold',fontSize:19
},featureheadingtiming:{
  fontSize: 30, fontWeight: 'bold'
}
  // Continue with other styles...
  
}
);

  // Other styles...
 export default styling
