import React ,{useState}from 'react';
import { useTheme2 } from '@grafana/ui';
import { css, cx } from '@emotion/css';
import {Detector} from './Detector'
//------------------------------------
// Function to draw all the detector strings
// Color comes from the callback
// click handler is passed from the parent
//------------------------------------
export function DetectorView ({selectedId,handleClick,dataCatalog,colorFunction})
{
    //------------------------
    //0:empty spot
    //1:top notch
    //2:regular
    //3:bottom notch
    //4:beveled
    //------------------------
    const detTypes = [
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0], //string 1, top to bottom
        [2,3,3,3,3,3,1,1,1,0,0,0,0,0],
        [2,2,4,4,4,4,4,4,4,0,0,0,0,0],
        [2,2,2,2,2,2,2,1,1,1,1,1,0,0],
        [1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,0,0,0,0,0,0,0],
        [2,2,3,1,1,1,1,1,1,1,0,0,0,0],
        [2,2,2,2,4,4,4,4,4,4,4,4,4,2],
        [2,2,2,2,2,2,2,2,1,1,1,1,1,0],
        [2,2,2,4,4,4,4,4,4,4,4,4,4,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0], //string 12, top to bottom
    ];
    let row     = 0;
    let col     = 0;
    let i       = 0;
    let xOffset = 30;
    let yOffset = 100;
    let xSpacing = 60;
    let ySpacing = 28;
    const theme   = useTheme2();
    function Label({x,y,row,col,text}){
        if(row==0 && col!=5)return <text x={x} y={y} style = {{stroke:theme.colors.secondary.text}}>{text}</text>
        else                return <></>;
    };
    let index=0;
    return (
        detTypes.map(function mapper(s) {
            if (Array.isArray(s)) return s.map(mapper);
            else {
                let x = xOffset+col*xSpacing;
                let y = yOffset+row*ySpacing;
                let aDet;
                const id        = 'Ge_'+index;
                const location  = dataCatalog.LUT[id];
                const color = colorFunction(dataCatalog.items[location]);

                aDet = <><Detector 
                    id       = {id}
                    location = {location} 
                    type     = {s} 
                    x        = {x} 
                    y        = {y} 
                    color    = {color} 
                    selected = {selectedId==location} 
                    handleClick={handleClick}/>

                    <Label x={x+10} y={y-25} col={col} row={row} text = {'Ge'+(col+1)} />

                    </>
                    index++;

                if(++row>13){
                    row=0;
                    col++;
                }
                return aDet
            }
        }
        )
    )
};

