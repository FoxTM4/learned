import React, { Component } from 'react';

class page1 extends Component {
    constructor(){
        super()


    }
    renderRps = ({ suiteScenariosBySuite, loadScenariosBySuite }) => {
		if (loadScenariosBySuite && suiteScenariosBySuite) {
			if (suiteScenariosBySuite.ids.length > 0) {
				let totalRpsTotal = 0
				Object.keys(suiteScenariosBySuite.entities).map(key => {
					let obj = suiteScenariosBySuite.entities[key]
					if (obj.active === true) {
						totalRpsTotal += obj.totalRps
					}
				})

				// let totalRps = scenarios.totalRps
				let clonedloadScenariosBySuite = { ...loadScenariosBySuite }
				clonedloadScenariosBySuite.ids.forEach(id => {
					let load = clonedloadScenariosBySuite.entities[id]
					let calculation = totalRpsTotal * (load.end / 100.0)
					load.targetRps = Math.round(calculation * 10) / 10
				})
				this.props.calculateLoadScenariosTargetRps(
					this.suiteId,
					clonedloadScenariosBySuite
				)
			}
		}
	}

    render() {
        return (
            <div>
                <div className="stair-chart">
							{loadScenarioRows.length >= 2 ? (
								<StairChart
									width={Math.max(1024, theData[0].totalDuration)}
									height={400}
									data={theData}
									strokeWidth={3}
									axisWidth={3}
									hideYAxis={false}
									xLabel={'Time (Minutes)'}
									yLabel={'Load (RPS)'}
									ticks={10}
									hidePoints={false}
									showLegends={true}
									// legendPosition={'bottom-left'}
								/>
							) : null}
						</div>
            </div>
        );
    }
}

export default page1;