import Felgo 3.0
import QtQuick 2.5
import QtQuick.Controls 2.0


FlickablePage {
    id: examplePage
    title: "Here's an example"
    preferredScreenOrientation: NativeUtils.ScreenOrientationPortrait





    //跳转至Creator界面
    AppButton {
         id:startyours
         text: "start showing your creativity"
         anchors.bottom:parent.bottom
         anchors.right: parent.right
         onClicked: stack.push(creator)
     }

}
