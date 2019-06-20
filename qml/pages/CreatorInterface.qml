import Felgo 3.0
import QtQuick 2.12
import Qt.labs.folderlistmodel 2.12
import QtQuick.Dialogs 1.3
import QtQuick.Controls 2.5 as QQC
import QtQuick.Dialogs 1.2
import "qrc:/js/poisson-disc-sampler.js" as EmojiKey


//FlickablePage{
Page {
    id: creatorInterface
    title: "Use your creativity"
    preferredScreenOrientation: NativeUtils.ScreenOrientationPortrait

    //应该有些参数！！
    //signal startConvert(mouseX,mouseY.....)
    signal startConvert()

    onStartConvert: {
        new EmojiKey.EmojiMosaic(fileOpen.fileUrl)
        console.log("222")
        if(theImage.state == "showPicture"){
            theImage.state = "showEmoji"
            console.log("->showEmoji")
        }else{
            theImage.state = "showPicture"
            console.log("->howPicturei")
        }
    }


    states: [
        State {
            name: "showPicture"
            PropertyChanges {
                target: theImage
                //z:1
                source: fileOpen.fileUrl
            }
        },
        State {
            name: "showEmoji"
            PropertyChanges {
                target:theImage
                //z:-1
                source:"qrc:/resized-emoji-images/resized-emoji-images/0001.png"
            }
        }
    ]

 /*
    states: [
        State {
            name: "showPicture"
            PropertyChanges {
                target: workAre
                delegate:theImage
            }
        },
        State {
            name: "showEmoji"
            PropertyChanges {
                target:workAre
                delegate:canvasForEmoji
            }
        }
    ]

    QQC.ComboBox{
        id:workAre
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top:parent.height*7/10
        anchors.bottom:parent.bottom

        delegate:intoEmoji
    }
    */


//打开一个图片按钮
    AppButton {
         id:opensomepic
         text: "Open Picture"
         //anchors.centerIn:parent
         onClicked: fileOpen.open()
         FileDialog {
             id: fileOpen
             title: "Select some picture files"
             folder: shortcuts.pictures
             nameFilters: [ "Image files (*.png *.jpeg *.jpg)" ]

             //setFilesModel(fileOpenDialog.fileUrls)
          }

         //rippleEffect : false
         //icon: IconType.calculator
     }
//转换成Emoji按钮
    AppButton {
         id:intoEmoji
         text: "Converted into emoji"
         anchors.horizontalCenter: parent.horizontalCenter
         //anchors.centerIn:parent
         onClicked: startConvert()

     }



        AppImage {
          id:theImage
          anchors.horizontalCenter: parent.horizontalCenter
          anchors.top:parent.height*7/10
          anchors.bottom:parent.bottom
          fillMode: AppImage.PreserveAspectFit
          source: fileOpen.fileUrl

          //z:1
          MouseArea {
            anchors.fill: theImage
            //onClicked: PictureViewer.show(getApplication(), parent.source)
            onClicked:console.log("11111")
            onPositionChanged:console.log(mouseX,mouseY)
            /*onPressed:{
                onPositionChanged:console.log(mouseX,mouseY)
            }*/
          }


        }


        /*
        //Canvas{
        AppImage{
            id:canvasForEmoji
            z:0
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.top:theImage.bottom
            anchors.bottom:parent.bottom
            MouseArea {
              anchors.fill: parentChanged()
              onClicked:console.log("333")
            }

            source:"qrc:/resized-emoji-images/resized-emoji-images/0001.png"
            //onPaint: {
                      //var ctx = getContext("2d");
                      //ctx.fillStyle = Qt.rgba(1, 0, 0, 1);
                      //ctx.fillRect(0, 0, width, height);
                 // }
        }
        */

     }





        //hoverEnabled: true
        //pressed:
        //onEntered: rect.color = "#cecfd5"
        //onExited: colorAnimation.start()
        //onEntered: console.log(mouseX,mouseY)
        //onExited: colorAnimation.start()



    /*
    Rectangle {
        id: rect
        anchors.centerIn: parent
        color: "#09102b"
        radius: size - gray * size
        implicitWidth: radius
        implicitHeight: radius
        //! [rectshape]

        //! [animation]
        ColorAnimation on color {
            id: colorAnimation
            running: false
            to: "#41cd52"
            duration: 1500
        }
        //! [animation]
    }
    */

//}



