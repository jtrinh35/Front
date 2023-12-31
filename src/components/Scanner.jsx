import React, { useEffect, useRef, useState } from "react";
import {
  configure,
  BarcodePicker as ScanditSDKBarcodePicker,
} from "scandit-sdk";

const licenseKey = process.env.REACT_APP_SCANDIT_KEY;
const configurationPromise = configure(licenseKey, {
  engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk/build",
}).catch((error) => {
  alert(error);
});

const Scanner = (props) => {
  let scanner;
  let reference = useRef();
  const scannerInstanceRef = useRef(null);
  const [scanSetting, setScanSetting] = useState(props.scanSettings);
  const [visible, setVisible] = useState(props.visible);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    configurationPromise.then(() => {
      
      ScanditSDKBarcodePicker.create(reference.current, props, {})
        .then((barcodePicker) => {
      
          scanner = barcodePicker;
          scannerInstanceRef.current = scanner;
          barcodePicker.on("ready", ()=>{
            setIsLoading(false);
            
          });
          
          if (props.onScan != null) {
            barcodePicker.on("scan", props.onScan);
          }
          /*if (props.onError != null) {
            barcodePicker.on('scanError', props.onError);
          }*/
          if (props.pause === true) {
            barcodePicker.pauseScanning();
          } else {
            barcodePicker.resumeScanning();
          }
        })
        .catch((error) => {
          console.error("caught error: ", error);
          if (error.name == "NotAllowedError") {
            // catch an error from create() method
            // and exectue needed functions here
            alert("Camera access denied by user!");
          }
        });
    });
  
  }, []);

  useEffect(() => {
    return () => {
      if (scanner != null) {
        scanner.destroy();
      }
    };
  }, []);

  useEffect(() => {
    console.log("---props pause value");
    console.log(props.pause);
    if (scannerInstanceRef.current) {
      if (props.pause === true) {
        scannerInstanceRef.current.pauseScanning();
      } else {
        scannerInstanceRef.current.resumeScanning();
      }
    }
  }, [props.pause]);

  useEffect(() => {
    if (JSON.stringify(scanSetting) !== JSON.stringify(props.scanSettings)) {
      scanner.applyScanSettings(props.scanSettings);
      setScanSetting(props.scanSettings);
      
    }

    if (visible !== props.visible) {
      scanner.setVisible(props.visible);
      setVisible(props.visible);
      
    }
  }, [scanSetting, visible]);


  return (
  <> 
  {isLoading ? <>
    <div
                        className="absolute z-50 h-screen w-screen "
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        <div className="z-50 absolute left-2/4 top-[25%]  -translate-x-2/4 ">
                          <div class="lds-spinner white">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                      </div>
  
  
  </> : <></>}
  <div ref={reference} />
  
  </>
  );
};

export default Scanner;
