import Felgo 3.0
import QtQuick 2.12
import QtQuick.Controls 2.5 as QQC
import "pages"
import "helper"

/*/////////////////////////////////////
  NOTE:
  Additional integration steps are needed to use Felgo Plugins, for example to add and link required libraries for Android and iOS.
  Please follow the integration steps described in the plugin documentation of your chosen plugins:
  - AdMob: https://felgo.com/doc/plugin-admob/
  - Local Notifications: https://felgo.com/doc/plugin-notification/

  To open the documentation of a plugin item in Qt Creator, place your cursor on the item in your QML code and press F1.
  This allows to view the properties, methods and signals of Felgo Plugins directly in Qt Creator.

/////////////////////////////////////*/

App {
    id:app
    // You get free licenseKeys from https://felgo.com/licenseKey
    // With a licenseKey you can:
    //  * Publish your games & apps for the app stores
    //  * Remove the Felgo Splash Screen or set a custom one (available with the Pro Licenses)
    //  * Add plugins to monetize, analyze & improve your apps (available with the Pro Licenses)
    //licenseKey: "<generate one from https://felgo.com/licenseKey>"

    // This item contains example code for the chosen Felgo Plugins
    // It is hidden by default and will overlay the QML items below if shown
    PluginMainItem {
        id: pluginMainItem
        z: 1           // display the plugin example above other items in the QML code below
        visible: false // set this to true to show the plugin example

        // keep only one instance of these plugin-pages alive within app
        // this prevents crashes due to destruction of plugin items when popping pages from the stack
        property alias notificationPage: notificationPage

        LocalNotificationPage {
            id: notificationPage
            visible: false
            onPopped: { notificationPage.parent = pluginMainItem; visible = false }
        }
    }

    NavigationStack {
        id:stack

        Page {
            //title: qsTr("Main Page")
            SectionHeader { icon: IconType.paintbrush; text: "User Interface Styling" }
            SectionDescription { text: "You can customize the styling of all UI components and controls, or use the default native look & feel of your platform.\n
        Change the tint color or switch the platform theme below. All UI elements will then update their look." }


         //添加一个示例说明
             AppButton {
                  id:exampleButton
                  text: "Here's an example"
                  anchors.centerIn:parent
                  onClicked: stack.push(example)
                  //rippleEffect : false
                  //icon: IconType.calculator
              }

             Component {
                 id: example
                 ExamplePage{}
              }


            //跳转至主要操作界面
            AppButton {
                   id:creatorButton
                   text: "Creator"
                   //flat:true
                   anchors.top:exampleButton.bottom
                   anchors.horizontalCenter:exampleButton.horizontalCenter
                   anchors.topMargin: 15
                   rippleEffect : true
                   onClicked: stack.push(creator)
            }

             Component {
                  id: creator
                  CreatorInterface{}
             }



/*            Image {
                source: "../assets/felgo-logo.png"
                anchors.centerIn: parent
            }
            */
        }

    }
}
