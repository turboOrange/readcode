import { Radar } from "react-chartjs-2";
import { Box } from "@mui/material";
import 'chart.js/auto';

const StatsChart = ({personal, global}) => {
    //

    const data = {
        labels:['General', 'Justesse', 'Completude', 'Clarete', 'Profondeur'],
        datasets : [
            {
                label:'Personnel',
                data: Object.values(personal?._avg || {}),
                backgroundColor: 'rgba(33,150,243,0.2)',
                borderColor : 'rgba(33,150,243,1)',
                borderWidth: 1,
            },
            {
                label:'Global',
                data:Object.values(global?._avg || {}),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ]
    }

    const options = {
        scales : {
            r: {
                suggestedMax:100,
                ticks: {
                    stepSize:10
                }
            },
        },
        responsive:true
    }
    return (
        personal && global && <Radar data={data} options={options}/>
    )
}

export default StatsChart;