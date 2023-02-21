import React ,{useState}from 'react';
import {useTheme2 } from '@grafana/ui';
import {css, cx } from '@emotion/css';
import {Detector} from './Detector'
//------------------------------------
// Function to draw all the SiPms
// Color comes from the callback
// click handler is passed from the parent
//------------------------------------
export function SiPMView({selectedId,handleClick,dataCatalog,colorFunction})
{
    const detTypes = [
        [5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0],
        [5,5,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0],
        [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
        [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6]
    ];    
    const ind = [
        [0,  2, 4, 6, 8,10,12,14,16,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [1,  3, 5, 7, 9,11,13,15,17,-1,-1-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56],
        [19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57]
    ];
    let row      = 0;
    let col      = 0;
    let i        = 0;
    let xOffset  = 0;
    let yOffset  = 0;
    let xSpacing = 0;

    const theme   = useTheme2();
     return (
        detTypes.map(function mapper(s) {
            if (Array.isArray(s)) return s.map(mapper);
            else {
                var aDet;
                const i         = ind[col][row];
                const yAdjust   = 0;
                const xAdjust   = 0;
                if(i<=17){
                    //the inner SiPM
                    if(!(i%2)){
                        xOffset  = 15;  //from left side
                        yOffset  = 60;  //from top
                        xSpacing = 80;  //distance to next to the right
                    }
                    else {
                        xOffset  = 15;
                        yOffset  = 490;
                        xSpacing = 80;
                    }
                }
                else {
                    //the Outer SiPMs
                    if(!(i%2)){
                        xOffset  = 6;
                        yOffset  = 35;
                        xSpacing = 37;
                    }
                    else {
                        xOffset  = 6;
                        yOffset  = 515;
                        xSpacing = 37;
                    }
                }
                const x        = xOffset+row*xSpacing;
                const y        = yOffset+col;
                var id       = -1;
                var location = '';
                if(i>=0){
                    id = 'SiPM_'+i;
                    location  = dataCatalog.LUT[id];
                }
                let color = colorFunction(dataCatalog.items[location]);
                {location!=''?(aDet = <Detector 
                    id       = {id} 
                    location = {location}
                    type     = {s} 
                    x        = {x} 
                    y        = {y} 
                    color    = {color} 
                    selected = {selectedId==location} 
                    handleClick={handleClick}/>
                ):(<></>)}
                     if(++row>19){
                        row=0;
                        col++;
                    }
                return aDet
            }
        }
        )
    )
};

export function LableSiPMs()
{
    const theme   = useTheme2();
 
    return (
        <>
        <text x="750" y="35" style = {{ fill:theme.isLight?'black':'white' }}>Top0B</text>
        <text x="750" y="60" style = {{ fill:theme.isLight?'black':'white' }}>TopIB</text>
        <text x="750" y="485" style = {{ fill:theme.isLight?'black':'white' }}>BotIB</text>
        <text x="750" y="515" style = {{ fill:theme.isLight?'black':'white' }}>BotOB</text>
        </>
    );
}
