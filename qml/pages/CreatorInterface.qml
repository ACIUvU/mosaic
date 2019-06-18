import Felgo 3.0
import QtQuick 2.12
import Qt.labs.folderlistmodel 2.12
import QtQuick.Dialogs 1.3
import QtQuick.Controls 2.5 as QQC
import QtQuick.Dialogs 1.2



FlickablePage {
    id: creatorInterface
    title: "Use your creativity"
    preferredScreenOrientation: NativeUtils.ScreenOrientationPortrait



    AppButton {
         id:opesomepic
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




    AppImage {
      id:theImage
      anchors.horizontalCenter: parent.horizontalCenter
      anchors.top:parent.height*7/10
      anchors.bottom:parent.bottom
      fillMode: AppImage.PreserveAspectFit
      source: fileOpen.fileUrl
      MouseArea {
        anchors.fill: theImage
        //onClicked: PictureViewer.show(getApplication(), parent.source)
        onClicked:console.log("11111")
      }

    }

}



