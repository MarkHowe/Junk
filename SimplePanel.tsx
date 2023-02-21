import React,{useState,useEffect}         from 'react';

import {PanelProps}             from '@grafana/data';
import {SimpleOptions}          from 'types';
import {css, cx}                from '@emotion/css';
import {useStyles2,useTheme2}             from '@grafana/ui';
import {DetectorView}           from './DetectorView'
import {CC4View}                from './CC4View'
import {CrateView}              from './CrateView'
import {SiPMView,LableSiPMs}    from './SiPMView'
import {InfoView}               from './InfoView'
import {DialogView}             from './DialogView'

import {Parse}                  from './Parse'
import {YAxis,ValueToColor,OnOffLegend} from './ViewLegend'
import './Legend.css'
interface Props extends PanelProps<SimpleOptions> {}

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
};

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
 
  const styles = useStyles2(getStyles);
  const theme  = useTheme2();

   //-------------------------------------------------
  // Tables for the menus
  //-------------------------------------------------
  const viewOptions = {
    'Ge'     : {label: 'Detectors' },
    'CC4'    : {label: 'PreAmps'},
    'Crate'  : {label: 'Crate'},
    'Dialog' : {label: 'Dialog'}
  };
  const offColor  = '#552222';
  const onColor = '#22aa22';
  const variableOptions = {
    'chanEnabled'   :{label: 'Online',      isBinary:true,  isLog:false, domain:[0,1],        colorRange:[offColor,onColor]},
    'trigOutEnable' :{label: 'TrigEnable',  isBinary:true,  isLog:false, domain:[0,1],        colorRange:[offColor,onColor]},
    'adcGain'       :{label: 'ADC Gain',    isBinary:false, isLog:false, domain:[0,16],       colorRange:['#2222aa','#22aa22']},
    'shapeTime'     :{label: 'Shape Time',  isBinary:false, isLog:true,  domain:[1,40000],    colorRange:['#2222aa','#22aa22']},
    'flatTopTime'   :{label: 'FlatTop',     isBinary:false, isLog:true,  domain:[1,100000000],colorRange:['#2222aa','#22aa22']},
    'poleZeroTime'  :{label: 'PZ Time',     isBinary:false, isLog:true,  domain:[1,100000000],colorRange:['#2222aa','#22aa22']},
    'postTrigger'   :{label: 'Post Trigger',isBinary:false, isLog:true,  domain:[1,393216],   colorRange:['#2222aa','#22aa22']},
    'baseline'      :{label: 'BaseLine',    isBinary:false, isLog:false, domain:[-1,4096],    colorRange:['#2222aa','#22aa22']},
    'baseLineBias'  :{label: 'BL Bias',     isBinary:false, isLog:false, domain:[1,2048],     colorRange:['#2222aa','#22aa22']},
    'threshold'     :{label: 'Threshold',   isBinary:false, isLog:true,  domain:[1,5000],     colorRange:['#2222aa','#22aa22']},
    'trigCounts'    :{label: 'Trig Counts', isBinary:false, isLog:true,  domain:[1,50000],    colorRange:['#2222aa','#22aa22']},
    'trigRates'     :{label: 'Trig Rate',   isBinary:false, isLog:true,  domain:[1,2000],    colorRange:['#2222aa','#22aa22']},
    'wfCounts'      :{label: 'WF Counts',   isBinary:false, isLog:true,  domain:[1,50000],    colorRange:['#2222aa','#22aa22']},
    'wfRates'       :{label: 'WF Rate',     isBinary:false, isLog:true,  domain:[1,2000],    colorRange:['#2222aa','#22aa22']},
    'Baseline'      :{label: 'ADC Baseline',isBinary:false, isLog:true,  domain:[1,5000],    colorRange:['#2222aa','#22aa22']},
  };
  //-------------------------------------------------
  // callbacks for buttons and detector clicks
  //-------------------------------------------------
  const handleViewChange = (event) => {
    setViewToShow(event.target.value);
    window.localStorage.setItem('view_To_Show', JSON.stringify(event.target.value));
  };

  const handleVariableChange = (event) => {
    setVariableToShow(event.target.value);
    window.localStorage.setItem('variable_To_Show', JSON.stringify(event.target.value));
  };
  
  function handleDetClick(e,location) {
    setSelectedId(location===selectedId?'':location);
    window.localStorage.setItem('selected_id', JSON.stringify(location));
  }
  
 
  //-------------------------------------------------
  // app state
  //-------------------------------------------------
  const [selectedId,setSelectedId]         = useState('');            //selected and hightlighted detector
  const [viewToShow,setViewToShow]         = useState('Ge');          //Ge,CC4,Crate
  const [variableToShow,setVariableToShow] = useState('chanEnabled'); //user selected variable
  //-------------------------------------------------
  // react hooks to save state
  //-------------------------------------------------
   useEffect(() => {
    const view = JSON.parse(window.localStorage.getItem('view_To_Show'));
    if (view) setViewToShow(view);
  }, []);

  useEffect(() => {
    const aVar = JSON.parse(window.localStorage.getItem('variable_To_Show'));
    if (aVar) setVariableToShow(aVar);
  }, []);
  useEffect(() => {
    const aVar = JSON.parse(window.localStorage.getItem('selected_id'));
    if (aVar) setSelectedId(aVar);
  }, []);
  //-------------------------------------------------
  // call back from the detector asking for its color
  //-------------------------------------------------
function getColor(detData)
  {
    if(detData==undefined)return 'transparent';
    else {
      const info  = variableOptions[variableToShow];
      const value = detData[variableToShow];
      return ValueToColor(info,value);
    }
  }
  //-------------------------------------------------
  //put all data into table indexed by crate,slot,chan
  //and create a look up table by ORCA group ID
  //-------------------------------------------------
  const dataCatalog = Parse(data);
  //-------------------------------------------------
  //below is the main display code
  //-------------------------------------------------
  return (
    <div
      className={cx(
        styles.wrapper,
        css` width: ${width}px; height: ${height}px; `
      )}
    >
    <svg
      className = {styles.svg}
      width     = {width}
      height    = {height}
      viewBox   = {`0 0 ${width} ${height}`}
    >
    {viewToShow === 'Ge' && 
        <DetectorView 
          selectedId   = {selectedId} 
          handleClick  = {handleDetClick}
          dataCatalog  = {dataCatalog}
          colorFunction = {getColor}
        />
    }
    {viewToShow === 'CC4' &&
        <CC4View 
          selectedId  = {selectedId} 
          handleClick = {handleDetClick}
          dataCatalog = {dataCatalog}
          colorFunction = {getColor}
        />
    }
    {viewToShow === 'Crate' &&
        <CrateView 
          selectedId   = {selectedId} 
          handleClick  = {handleDetClick}
          dataCatalog  = {dataCatalog}
          colorFunction = {getColor}
        />
    }
    {(viewToShow === 'Ge' || viewToShow === 'CC4') &&
    <>
        <SiPMView
          selectedId  = {selectedId} 
          handleClick = {handleDetClick}
          dataCatalog = {dataCatalog}
          colorFunction = {getColor}
        />
        <LableSiPMs />
      </>
    }
    </svg>
    {viewToShow === 'Dialog' &&
        <DialogView 
          selectedId   = {selectedId} 
          dataCatalog  = {dataCatalog}
        />
    }
    {viewToShow != 'Dialog' &&
      <InfoView className='info1' id={selectedId} dataCatalog={dataCatalog}/>
    }
    <div  className='dropDown1'>
      <Dropdown
        state    = {viewToShow}
        options  = {viewOptions}
        onChange = {handleViewChange}
        colorFunction = {getColor}
      />
    </div>

    <div  className='dropDown2'>
      <Dropdown
        state    = {variableToShow}
        options  = {variableOptions}
        onChange = {handleVariableChange}
        colorFunction = {getColor}
      />
    </div>
    
    {(!variableOptions[variableToShow].isBinary && viewToShow != 'Dialog') &&
      <div className='axis1'>
        <YAxis  isLog = {variableOptions[variableToShow].isLog     } 
          colorScheme = {variableOptions[variableToShow].colorRange} 
          scaleDomain = {variableOptions[variableToShow].domain    } 
          label       = {variableOptions[variableToShow].label     }
      />
      </div>
    }
    {(variableOptions[variableToShow].isBinary && viewToShow != 'Dialog') &&
      <div className='axis1'>
        <OnOffLegend label = {variableOptions[variableToShow].label} 
                  colorOn  = {variableOptions[variableToShow].colorRange[1]} 
                  colorOff = {variableOptions[variableToShow].colorRange[0]}/>
      </div>
    }
  </div>
  );
};

const Dropdown = (props) => {
  const { state, options, onChange } = props;
  return (
    <>
      <select className="dropbtn" value={state} onChange={onChange}>
        {
          Object.keys(options).map((aKey) => {
            return <option value={aKey}>{options[aKey].label}</option>
        })
        }
      </select>
    </>
  )
 }
