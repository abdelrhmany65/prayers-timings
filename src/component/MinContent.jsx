import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2';
import  './Mincontent.css'
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Midal from './Midal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";
 moment.locale("ar")


function MinContent() {
    // stats
    const [timings, settimings]= useState({
        Fajr: "05:22",
        Dhuhr: "12:04",
        Asr: "14:54",
        Maghrib: "17:13",
        Isha: "18:36",
    });
    
    const [selctCity, setselctCity] = useState({
        displayname:'القاهرة',
        apiname:'Cairo'
    })

    const [today, settoday] = useState("")
    const [timer, settimer] = useState("")
    const [nextPrayerindex, setnextPrayerindex] = useState(2)
    const [remainingTime, setremainingTime] = useState("")
    

    const avilbalcity = [
        {
            displayname:'القاهرة',
            apiname:'Cairo'
        },
        {
            displayname:'اسكندرية',
            apiname:'Alexandria'
        }, 
        {
            displayname:'أسوان',
            apiname:'Aswan'
        }
    ]

    const preyerArray = [
        {key: "Fajr", displayname:'الفجر'},
        {key: "Dhuhr", displayname:'الضهر'},
        {key: "Asr", displayname:'العصر'},
        {key: "Maghrib", displayname:'المغرب'},
        {key: "Isha", displayname:'العشاء'},
    ] 
    const gettiming = async () =>{
        
        const rsponse = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=EG&city=${selctCity.apiname}`)
        settimings(rsponse.data.data.timings)
    }
    useEffect(() =>{
        gettiming()
        const t = moment()
        settoday(t.format("MMM Do YYYY | h:mm"))
    },[selctCity])



    useEffect(()=>{
        let interval = setInterval(()=>{
            SetUpCountTimer()
        },
        1000);

        return () => {clearInterval(interval)}
    },[timings])


    const handleChange = (event) => {
        const cityobj = avilbalcity.find((city) => {
            return city.apiname == event.target.value
        });
        setselctCity(cityobj)
        
    }

    const SetUpCountTimer = () => {
         const momentNow = moment();

         let Prayerindex = 2; 

         if (momentNow.isBefore(moment( timings["Fajr"],"hh:mm"))
         && momentNow.isBefore(moment( timings["Dhuhr"],"hh:mm"))) {

            Prayerindex = 1; 
            
         } else if(momentNow.isBefore(moment( timings["Dhuhr"],"hh:mm"))
         && momentNow.isBefore(moment( timings["Asr"],"hh:mm"))) {

            Prayerindex = 2; 
            
         }else if(momentNow.isBefore(moment( timings["Asr"],"hh:mm"))
         && momentNow.isBefore(moment( timings["Maghrib"],"hh:mm"))) {

            Prayerindex = 3; 
        
         }else if(momentNow.isBefore(moment( timings["Maghrib"],"hh:mm"))
         && momentNow.isBefore(moment( timings["Isha"],"hh:mm"))) {

            Prayerindex = 4; 
        
         }else {
            Prayerindex = 0; 
         }
 
         
        setnextPrayerindex(Prayerindex)
         
         const nextPrayerObj = preyerArray[Prayerindex];
         const nextPrayerTimer = timings[nextPrayerObj.key];
         const nextPrayerTimeObj = moment(nextPrayerTimer, "hh:mm")

         let remainTiming = moment(nextPrayerTimer, "hh:mm").diff(momentNow);

         if (remainTiming < 0) {
            const midinnight = moment("23:59:59", "hh:mm:ss").diff(momentNow)
            // console.log(midinnight);

            const FajrToMidNight = nextPrayerTimeObj.diff(moment("00:00:00", "hh:mm:ss"))
        
            const ToTalDifrance = midinnight + FajrToMidNight

            remainTiming = ToTalDifrance; 
        }

         const mduration = moment.duration(remainTiming)
         
         setremainingTime(`${mduration.seconds()}: ${mduration.minutes()}: ${mduration.hours()}`)

         
         

        //  console.log(mduration.min());
         
    }
     
  return (
    <div>
        <Grid container className='mincontent'>
            <Grid xs={6}>
                <div>
                    <h2>{today}</h2>
                    <h1>{selctCity.displayname} </h1>
                </div>
            </Grid>

            <Grid xs={6}>
                <div>
                    <h2>متبقي حتي الصلاة {preyerArray[nextPrayerindex].displayname}</h2>
                    <h1>{remainingTime} </h1>
                </div>
            </Grid>

        </Grid>

        <Divider style={{borderColor: "white", opacity: "0.1", margin:"45px 0"}}/>

        <Stack direction="row" justifyContent={"space-around"}>
            <Midal name="الفجر" time={timings.Fajr} image="https://th.bing.com/th/id/OIG.kUTpmBgJFfUXr1QC3tVP?w=1024&h=1024&rs=1&pid=ImgDetMain" />
            <Midal name="الظهر" time={timings.Dhuhr} image="https://th.bing.com/th/id/OIG.mzQQxqPRmcBXGOhUQOCT?pid=ImgGn" />
            <Midal name="العصر" time={timings.Asr} image="https://th.bing.com/th/id/OIG.c_QlYd21pZIdFbg.l0gx?pid=ImgGn" />
            <Midal name="المغرب" time={timings.Maghrib} image="https://th.bing.com/th/id/OIG.YldB4nhB04iA3s6mdSle?pid=ImgGn" />
            <Midal name="العشاء" time={timings.Isha} image="https://th.bing.com/th/id/OIG.sZazXwrBUeAdA4M4JQg4?pid=ImgGn" />
        </Stack>

        <Stack direction="row" justifyContent={"center"} style={{ marginTop:"55px" }}>
            <FormControl style={{ width:"20%" }} >
                <InputLabel id="demo-simple-select-label">
                    <span style={{ color:"white" }}>.القاهرة</span>
                </InputLabel>
                <Select 
                
                style={{ color:"white" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value= ""
                label="Age"
                onChange={handleChange}
                >

                {avilbalcity.map( (city)=> {
                    return(
                     <MenuItem value= {city.apiname} 
                        key = {city.apiname} > 
                        
                        {city.displayname}
                     </MenuItem>

                    )

                })}

                </Select>
            </FormControl>
        </Stack>
    </div>
  )
}

export default MinContent

