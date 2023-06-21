import React, { useEffect, useState } from 'react';
import ScanditBarcodeScanner from "scandit-sdk-react";
import * as ScanditSDK from "scandit-sdk";
import {
  Barcode,
  BarcodePicker,
  Camera,
  CameraAccess,
  CameraSettings,
  ScanResult,
  ScanSettings,
  SingleImageModeSettings,
} from "scandit-sdk";
import { useDispatch, useSelector } from 'react-redux';
import useAxiosInterceptors from '../axios/useAxios';
import { verifOrder } from '../actions/orderActions';
import { useNavigate } from 'react-router-dom';

const ScanCheck = () => {

    const {success, loading} = useSelector(state => state.orderVerif);
    const orderDetails = useSelector(state => state.orderDetails.order)
    const [Code, setCode] = useState()
    const [access, setAccess] = useState(true)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const axiosInstance = useAxiosInterceptors()

    const getScanSettings = () => {
        return new ScanditSDK.ScanSettings({
        enabledSymbologies: ["ean8", "ean13", "upca", "code128", "maxicode"],
        codeDuplicateFilter: 2500,
        searchArea: { x: 0, y: 0, width: 1, height: 1 },
        maxNumberOfCodesPerFrame: 1,
        });
    };
    const scan = () => {
        console.log(access)
        if (access) {
          return (
            <div className="successScandit">
              <ScanditBarcodeScanner
                licenseKey={process.env.REACT_APP_SCANDIT_KEY}
                engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build"
                preloadBlurryRecognition={true}
                preloadEngine={true}
                accessCamera={true}
                guiStyle={BarcodePicker.GuiStyle.VIEWFINDER}
                viewFinderArea={{ x: 0.2, y: 0.01, width: 0.6, height: 0.5 }}
                onScan={(scanResult) => {
                  setCode(scanResult.barcodes[0].data);
                  console.log(scanResult.barcodes[0].data);
                }}
                scanSettings={getScanSettings()}
                videoFit={BarcodePicker.ObjectFit.COVER}
                playSoundOnScan={true}
                enableCameraSwitcher={false}
                enablePinchToZoom={false}
                enableTapToFocus={true}
                enableTorchToggle={false}
                mirrorImage={true}
                zoom={0}

              />
            </div>
         
          );
        } else {
            return (
                <>
                </>
            )
        }
      };

      useEffect(() => {
        console.log("-----------code--------------")
        console.log(Code)
        if(Code === 'You shall not pass'){
            dispatch(verifOrder(orderDetails._id, axiosInstance))
        }
      }, [Code])

      useEffect(() => {
        if(success){
            setAccess(false)
            navigate(`/ordersuccess/${orderDetails._id}`)
        }
      }, [success])

    return (
        <>
            {loading ? (
                <div id="loader" class="loader loader-default is-active" data-text="Vérification en cours"></div>
            ) : (
                <div className='w-full h-full bg-white flex flex-col overflow-auto '>

                <div className=' flex flex-col  items-center pt-16 px-8 gap-5'>
                  <div className='flex justify-center items-center gap-5'> <img
                    src="/images/success.png"
                    alt="logo_success"
                    className="w-12 mb-3 h-auto"
                  />

                  <h3 className="text-center text-2xl mb-1">Payment Successful</h3> </div>
                   
                    <h2 className='text-4xl '>Dernière étape</h2>

                    <div className='scan-instruction p-10 rounded-[22px] ' >
                      <h2 className='text-3xl '> Scannez le code QR de sortie</h2>
                      <p className="text-2xl" style={{ fontFamily: "intermedium" }}>Pour afficher le reçu</p>

                      <p className="mt-5 text-2xl" style={{ fontFamily: "intermedium" }}>The exit QR code is <strong> in a yellow frame</strong> and <strong>it is located near the payment desks</strong>. Please speak to a member of staff if you require help.</p>
                    </div>
                </div>
                <div  className='h-1/2 p-8 pt-10'>

                    {scan()}
              
                </div>
                </div>
            )}          
        </>
        
    );
};

export default ScanCheck;