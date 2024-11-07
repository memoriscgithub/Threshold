import React, { useEffect, useRef, useState } from 'react';

const PixelGrid = () => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pointPosition, setPointPosition] = useState({ x: -1, y: 100 });
  const [showCornerLabels, setShowCornerLabels] = useState(false);
  const [savedCornerLabelsState, setSavedCornerLabelsState] = useState(false);
  const [showPrimeLabels, setShowPrimeLabels] = useState(false);
  const [primeCorners, setPrimeCorners] = useState({ startX: 0, startY: 0, endX: 0, endY: 0 });
  const [showError, setShowError] = useState(false);
  const [lastControl, setLastControl] = useState(0);
  const [showThreshold, setShowThreshold] = useState(false);
  
  const pixelSize = 8;
  const gap = 1;
  const count = 100;
  const pointSize = 8;
  const lineWidth = 8;
  const darkGray = 'rgb(55, 65, 81)';
  const canvasWidth = 908;
  const orangeColor = 'rgb(255, 165, 0)';

  const calculateControl = () => {
    if (pointPosition.x < 0 || pointPosition.y === 100) return 0;
    const totalWhiteCells = 100 * 100;
    let controlledCells = 0;
    if (pointPosition.x >= 0 && pointPosition.y < 100) {
      controlledCells = (pointPosition.x + 1) * (100 - pointPosition.y);
    }
    return Math.min(100, (controlledCells / totalWhiteCells) * 100);
  };

  const getStatus = (controlValue) => {
    if (controlValue === 50) return "Threshold";
    return controlValue > 50 ? "DEMIURGE" : "semiurge";
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgb(107, 114, 128)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = darkGray;
    for(let row = 0; row <= count; row++) {
      ctx.fillRect(0, row * (pixelSize + gap), pixelSize, pixelSize);
    }
    for(let col = 0; col <= count; col++) {
      ctx.fillRect(col * (pixelSize + gap), count * (pixelSize + gap), pixelSize, pixelSize);
    }
    
    ctx.fillStyle = '#ffffff';
    for(let row = 0; row < count; row++) {
      for(let col = 1; col <= count; col++) {
        ctx.fillRect(col * (pixelSize + gap), row * (pixelSize + gap), pixelSize, pixelSize);
      }
    }

    const pointScreenX = (pointPosition.x + 1) * (pixelSize + gap) + pixelSize / 2;
    const pointScreenY = pointPosition.y * (pixelSize + gap) + pixelSize / 2;

    if (pointPosition.x > -1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = lineWidth;
      ctx.moveTo(pointScreenX, pointScreenY);
      ctx.lineTo(pixelSize + gap, pointScreenY);
      ctx.stroke();
    }

    const ezoptronValue = 100 - pointPosition.y;
    if (pointPosition.y < 100 && ezoptronValue !== 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = lineWidth;
      ctx.moveTo(pointScreenX, pointScreenY);
      ctx.lineTo(pointScreenX, count * (pixelSize + gap));
      ctx.stroke();
    }

    if (showPrimeLabels && pointPosition.x >= 0 && pointPosition.y < 100) {
      const startX = pixelSize + gap;
      const startY = count * (pixelSize + gap);
      const endX = (pointPosition.x + 1) * (pixelSize + gap) + pixelSize;
      const endY = pointPosition.y * (pixelSize + gap);

      ctx.fillStyle = orangeColor;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX, endY);
      ctx.lineTo(endX, endY);
      ctx.lineTo(endX, startY);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = '#3b82f6';
    const pixelX = (pointPosition.x + 1) * (pixelSize + gap) + (pixelSize - pointSize) / 2;
    const pixelY = pointPosition.y * (pixelSize + gap) + (pixelSize - pointSize) / 2;
    ctx.fillRect(pixelX, pixelY, pointSize, pointSize);
  };

  const getGridPosition = (clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    let gridX = Math.round(x / (pixelSize + gap)) - 1;
    let gridY = Math.round(y / (pixelSize + gap));
    gridX = Math.max(-1, Math.min(count - 1, gridX));
    gridY = Math.max(0, Math.min(count, gridY));
    return { x: gridX, y: gridY };
  };

  useEffect(() => {
    const control = calculateControl();
    if ((lastControl < 50 && control >= 50) || (lastControl > 50 && control <= 50)) {
      setShowThreshold(true);
      setTimeout(() => setShowThreshold(false), 1000);
    }
    setLastControl(control);
  }, [pointPosition]);

  const handleMouseDown = (e) => {
    setShowPrimeLabels(false);
    setShowCornerLabels(savedCornerLabelsState);
    const mousePos = getGridPosition(e.clientX, e.clientY);
    const mousePixelX = (mousePos.x + 1) * (pixelSize + gap) + (pixelSize - pointSize) / 2;
    const mousePixelY = mousePos.y * (pixelSize + gap) + (pixelSize - pointSize) / 2;
    const pointPixelX = (pointPosition.x + 1) * (pixelSize + gap) + (pixelSize - pointSize) / 2;
    const pointPixelY = pointPosition.y * (pixelSize + gap) + (pixelSize - pointSize) / 2;
    if (Math.abs(mousePixelX - pointPixelX) < pointSize * 1.5 && 
        Math.abs(mousePixelY - pointPixelY) < pointSize * 1.5) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const pos = getGridPosition(e.clientX, e.clientY);
      setPointPosition(pos);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handlePrimeLabelsChange = (e) => {
    const reparatronValue = pointPosition.x + 1;
    const ezoptronValue = 100 - pointPosition.y;
    if (reparatronValue === 0 || ezoptronValue === 0) {
      setShowError(true);
      return;
    }
    setShowPrimeLabels(e.target.checked);
    if (e.target.checked) {
      setSavedCornerLabelsState(showCornerLabels);
      setShowCornerLabels(false);
    } else {
      setShowCornerLabels(savedCornerLabelsState);
    }
  };

  useEffect(() => {
    drawCanvas();
    if (showPrimeLabels) {
      setPrimeCorners({
        startX: pixelSize + gap,
        startY: count * (pixelSize + gap),
        endX: (pointPosition.x + 1) * (pixelSize + gap) + pixelSize,
        endY: pointPosition.y * (pixelSize + gap)
      });
    }
  }, [pointPosition, showCornerLabels, showPrimeLabels]);

  useEffect(() => {
    if (showError) {
      const clearError = () => setShowError(false);
      window.addEventListener('mousedown', clearError);
      window.addEventListener('keydown', clearError);
      return () => {
        window.removeEventListener('mousedown', clearError);
        window.removeEventListener('keydown', clearError);
      };
    }
  }, [showError]);

  const controlValue = calculateControl();
  const status = getStatus(controlValue);

  const cornerStyle = "absolute rounded-full w-6 h-6 flex items-center justify-center font-serif";
  const orangeCornerStyle = `${cornerStyle} bg-orange-500`;

  return (
    <div className="bg-gray-500 flex flex-col items-center min-h-screen">
      <div className="h-8 flex items-center w-full justify-center">
        <div className="w-[908px] flex items-center">
          <h1 className="text-gray-300 font-normal font-serif text-sm">
            Simplified two-component 'panject-environment' ecosystem model
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-start relative -mt-1">
        <canvas 
          ref={canvasRef}
          width={canvasWidth}
          height={908}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {!showPrimeLabels && showCornerLabels && (
          <>
            <div className={`${cornerStyle} bg-white -left-8 bottom-0`}>A</div>
            <div className={`${cornerStyle} bg-white -left-8 top-0`}>B</div>
            <div className={`${cornerStyle} bg-white -right-8 top-0`}>C</div>
            <div className={`${cornerStyle} bg-white -right-8 bottom-0`}>D</div>
          </>
        )}
        {(showPrimeLabels || showThreshold) && (
          <>
            {showPrimeLabels && (
              <>
                <div className={`${orangeCornerStyle} -left-8 bottom-0`}>A'</div>
                <div className={`${orangeCornerStyle} -left-8`} style={{top: primeCorners.endY}}>B'</div>
                <div className={`${orangeCornerStyle}`} 
                     style={{top: primeCorners.endY, left: primeCorners.endX}}>C'</div>
                <div className={`${orangeCornerStyle}`} 
                     style={{bottom: 0, left: primeCorners.endX}}>D'</div>
              </>
            )}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                          bg-red-500 rounded-full w-32 h-32 flex items-center justify-center select-none">
              <span className="text-white text-base font-normal">
                {showThreshold ? "Threshold" : status}
              </span>
            </div>
          </>
        )}
      </div>
      {showError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          Both coordinates must be greater than zero
        </div>
      )}
      <div className="h-8 flex items-center justify-center mt-2">
        <div className="text-white font-mono text-sm flex items-center w-[1000px] px-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500" />
            <span>reparatron:</span>
            <span className="w-12 text-right">{pointPosition.x + 1}%</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className="w-2 h-2 bg-green-500" />
            <span>ezoptron:</span>
            <span className="w-12 text-right">{100 - pointPosition.y}%</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span>demiurgic control:</span>
            <span className="w-16 text-right">{controlValue.toFixed(2)}%</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span>status:</span>
            <span className="w-20">{status}</span>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span>show ABCD:</span>
            <input
              type="checkbox"
              checked={showCornerLabels}
              onChange={(e) => {
                setShowCornerLabels(e.target.checked);
                setSavedCornerLabelsState(e.target.checked);
              }}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <span>show A'B'C'D':</span>
            <input
              type="checkbox"
              checked={showPrimeLabels}
              onChange={handlePrimeLabelsChange}
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelGrid;
