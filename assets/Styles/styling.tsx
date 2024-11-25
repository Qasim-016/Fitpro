import dashboard from "@/app/(User)/Dashboard";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
const {width} = Dimensions.get('screen');
    const sidebarheaderwidth = width * 0.7;
    const {height} = Dimensions.get('screen');
    const sidebarheaderheight = height * 0.3;
    const featureimagewidth = width*0.4;
    const featureimageheight = height*0.2
const styling = StyleSheet.create({
    
    container: {
        flex: 1, justifyContent: "center", alignItems: "center"
    },
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
    placeholder: {
        backgroundColor: "white",
        width: 300,
        borderWidth: 1,
        borderRadius: 10, padding: 2, paddingHorizontal: 5
    },
   
     
    intro1container: { flex: 1, alignItems: 'center', paddingVertical: 90 },
    intro2container: { flex: 1, alignItems: 'center', paddingVertical: 100 },
    intro3container: { flex: 1, alignItems: 'center', paddingVertical: 60 },
    Backbtn:{flex:1,flexDirection:'row',gap:10,alignSelf:'flex-start',position:'absolute',top:40,left:20},
    HeaderText: { fontSize: 20, fontWeight: 'bold' },
    Heading: { fontSize: 30, fontWeight: 'bold' },
    Headinglong:{fontSize:30, fontWeight:'bold', textAlign:'center'},
    Paragraph: { textAlign: 'center', fontSize: 15, paddingHorizontal: 10 },
    DotsContainer: { flex: 1, flexDirection: 'row', gap: 10 },
    MarkDot: { color: '#2ECC71', fontSize: 60 },
    SimpleDot: { color: '#cccccc', fontSize: 60 },
    Nextbtn: { alignSelf: 'flex-end', position: 'absolute', bottom: 30, right: 20, backgroundColor: '#2ECC71', borderRadius: 30 },
    Link1: { color: '#2ecc71', alignSelf: 'flex-end' },
    Link2: { paddingBottom: 5 ,color:'#2ecc71'},
    Link3: { color: "#2ecc71" },
    Link3Text: { textDecorationLine: 'underline' ,color:'#2ecc71'},
    signupimg: { height: 57, width: 80 },
    loginimg: { height: 130, width: 170 },
    Indeximg: { height: 400, width: 400 },
    IndexView: { height: 70, marginTop: 30 },
    TextwithColor: { fontWeight: 'bold', color: '#2ecc71', fontSize: 30 },
    none:{},
    PlaceHolderView: { alignItems: 'flex-start', gap: 5 },
    inputContainer: {
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 0,
        marginBottom: 10,
    },
    textInput: {
        flex: 1,
        // paddingVertical: 5,
        fontSize: 15,
    },
    icon: {
        marginLeft: 8,
    },
    CenterItem:{alignItems:'center'},
    Boldfont:{fontWeight:'bold'},
    WelcomeContainer:{ 
        flex:1,
        paddingHorizontal:30,
        justifyContent:"center",
        alignItems:"center",
        // borderWidth:1,
        // borderColor:'#2ecc71'     
      },
      CenterLink:{
        color:'#2ecc71', alignSelf:'center'
      },
      freetrialbtn:{
        backgroundColor:'white',paddingHorizontal:20, paddingVertical: 5, borderRadius:10,width:300,alignItems:'center'
      },
      FreeTrialText:{
        color:'#2ecc71' ,fontSize:20,fontWeight:'bold'     }
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
        fontSize:50, color: "#2ECC71", fontWeight:"bold"
    },
    button:{},
    whitetextheading:{
        fontSize: 30,fontWeight:'bold', color:'white'
    },
    whitetextparagraph:{
        color:'white',textAlign: 'center', fontSize: 15, paddingHorizontal: 10 
    },
    NextBackbtnimage:{height:30,width:20},
    Gap:{gap:10},
    // styling.js
    marginright:{
    //  right:10
    },
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
        left: 0,
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
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ccc',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
      },
      closeText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      sidebarHeader: {
        position:'absolute',
        backgroundColor:'#2ecc71',
        width:sidebarheaderwidth,

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
position:'absolute',
width:width,
bottom:40, flexDirection: 'row', // Align items horizontally
justifyContent:'space-between', // Space between sidebar name and logo
alignItems: 'center', // Align them vertically in the center
paddingHorizontal: 20,height:50,
},
dashboardbtnimages:{height:35,width:30},selectedButton: {
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
  featureimage:{
    height:featureimageheight,width:featureimagewidth,borderRadius:10
  },featuresubview:{
    flexDirection:'row',
    gap:10
  }
  }
);
export default styling