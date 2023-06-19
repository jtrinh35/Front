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
        enabledSymbologies: ["ean8", "ean13", "upca", "code128"],
        codeDuplicateFilter: 2500,
        searchArea: { x: 0.025, y: 0.1, width: 0.95, height: 0.36 },
        maxNumberOfCodesPerFrame: 1,
        });
    };
    const scan = () => {
        console.log(access)
        if (access) {
          return (
            <div >
              <ScanditBarcodeScanner
                licenseKey={process.env.REACT_APP_SCANDIT_KEY}
                engineLocation="https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build"
                preloadBlurryRecognition={true}
                preloadEngine={true}
                accessCamera={true}
                guiStyle={BarcodePicker.GuiStyle.VIEWFINDER}
                viewFinderArea={{ x: 0.2, y: 0.01, width: 0.6, height: 0.1 }}
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
        console.log(Code)
        if(Code === '5000112611861'){
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
                <div className='w-full h-full bg-white'>
                <div className='h-1/2'>
                    Dirigez vous vers la sortie
                </div>

                    {scan()}
              

                </div>
            )}          
        </>
        
    );
};

export default ScanCheck;