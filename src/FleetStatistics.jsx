import React from 'react';
import {dateUtil} from './UtilsFunction'

export default function FleetStatistics({ statistics}) {
  return (<> <div className="heading">Fleet Statistics</div>

          <div className="dashboard-grid">
            <div className="metric-card">
              <div className="metric-value">{statistics.total}</div>
              <div className="metric-label">
                <span>TOTAL FLEET</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{statistics.average_speed}</div>
              <div className="metric-label">
                <span>AVG SPEED</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{statistics.en_route}</div>
              <div className="metric-label">
                <span>MOVING</span>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-value">
                {dateUtil(statistics.timestamp).toLocaleTimeString()}
              </div>
              <div className="metric-label">
                <span>LAST UPDATE</span>
              </div>
            </div>
          </div></>
   
  )
}
