import React ,{useState} from 'react';
import {Detector} from './Detector'
import {useTheme2 } from '@grafana/ui';
//------------------------------------
// Function to draw four crates
// Color comes from the callback
// click handler is passed from the parent
//------------------------------------
export function CrateView ({selectedId,handleClick,dataCatalog,colorFunction})
{    
    const theme   = useTheme2();
    const left        = 10;
    const bottom      = 350;
    const right       = 380;
    const top         = 65;
    const height      = 229;
    const slotWidth   = 25;
    const dd          = dataCatalog.items;
    const dets        = [];
    //-----------------------------------------------------------------------
    //create a list of detectors... tricky to get them into the correct slots
    //proably a better way of doing this. We'll just format their 
    //placement to match the crate and tweak the crate as needed
    //-----------------------------------------------------------------------
    const crateX = [left-slotWidth,right,left,right];
    const crateY = [bottom,bottom,top,top]
    for (let key in dd) {
        if(key.charAt(0)==='0'){
            const parts =key.split("_");
            if(parts.length < 3) continue;
            var crate = parseInt(parts[0]);
            var slot  = parseInt(parts[1]);
            var chan  = parseInt(parts[2]);
            if(crate==0)slot += 1;
            const numChans = dd[key].numChans;
            const detHeight = numChans==24?10:38;
            const detType   = numChans==24?9:8;
            if(!numChans)continue;
            const location = key;
            const xx = crateX[crate] + slot*slotWidth + 1;
            const yy = crateY[crate]+chan*detHeight;
            const color = colorFunction(dataCatalog.items[location]);
            const aDet = <Detector 
                            id       = {key} 
                            location = {key}
                            type     = {detType} //crate det
                            x        = {xx+1} 
                            y        = {yy} 
                            color    = {color} 
                            selected = {selectedId==location} 
                            handleClick={handleClick}/> 
        dets.push(aDet); 
        }
    }
    
    return (
        <>
        <text x={left}   y={top-8} font-size="1.2em" style = {{ fill:theme.colors.secondary.text }}>SiPM Crate</text>
        <Crate x={left}  y={top-3} numSlots={14} slotWidth={slotWidth} height = {height+5}/>
        
        <text x={right}  y={top-8} font-size="1.2em" style = {{ fill:theme.colors.secondary.text }}>Veto Crate</text>
        <Crate x={right} y={top-3} numSlots={14} slotWidth={slotWidth} height = {height+5}/>

        <text x={left}   y={bottom-8} font-size="1.2em" style = {{ fill:theme.colors.secondary.text }}>Crate 0</text>
        <Crate x={left}  y={bottom-3} numSlots={14} slotWidth={slotWidth} height = {height+5}/>

        <text x={right}  y={bottom-8} font-size="1.2em" style = {{ fill:theme.colors.secondary.text }}>Crate 1</text>
        <Crate x={right} y={bottom-3} numSlots={14} slotWidth={slotWidth} height={height+5}/>
        {dets}
         </>
    );
}

function Crate ({x,y,numSlots,slotWidth,height})
{
    const theme   = useTheme2();
    //has to be a more elegant way to do the following
    const list = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
    const lineList=list.map((i)=>{
        return  (
            <>
            <text x={x+(i*slotWidth)+4}  y={y+height+14} font-size="1em" style = {{ stroke:theme.colors.secondary.text }}>{i}</text>
            <line x1={x+(i*slotWidth)} y1={y} x2={x+(i*slotWidth)} y2={y+height} style = {{ stroke:theme.colors.secondary.text }} />    
            </>
        )
    });
    return (
        <>
        <rect x={x} y={y} width={numSlots*slotWidth} height={height} 
                style       = {{stroke: theme.colors.secondary.text }} 
                fill        = {"transparent"}
                strokeWidth = {2} 
        />
        {lineList}
        </>
    )
}