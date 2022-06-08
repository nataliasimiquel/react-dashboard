import React from "react";
export default function DailyEarnings() {
  return (
    <div>
      
      <div className="col-md-12" style={{maxWidth: 400}} >
        <div className="card-group m-b-30">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <span className="d-block">Ganhos Diários</span>
                  <p>100 mil reais</p>
                </div>
                <div>
                  <span className="text-success">+10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
