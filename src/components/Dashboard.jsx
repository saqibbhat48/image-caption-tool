// Import necessary modules and libraries
import React, { useState, useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import axios from 'axios';

function Dashboard() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const initCanvas = new fabric.Canvas('imageCanvas', {
      width: 800,
      height: 600,
      backgroundColor: '#f9fafb',
    });
    canvasRef.current = initCanvas;
  
    return () => {
      initCanvas.dispose();
    };
  }, []);
  

  const fetchImages = async () => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search`, {
        headers: {
          Authorization: 'KiByXQD50pzBdldCAOJAM7lIwGLA5vvaPEGeM94n1y2sTRvyr4i1jsoj', 
        },
        params: { query, per_page: 12 },
      });
      setImages(response.data.photos);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleAddToCanvas = (imageUrl) => {
    const canvas = canvasRef.current;
  
    if (!canvas) {
      console.error('Canvas is not initialized.');
      return;
    }
  
    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous'; // Handle CORS
    imgElement.src = imageUrl;
  
    imgElement.onload = () => {
      const fabricImage = new fabric.Image(imgElement);
      fabricImage.set({
        left: (canvas.width - imgElement.width) / 2,
        top: (canvas.height - imgElement.height) / 2,
        selectable: true,
      });
  
      canvas.add(fabricImage);
      canvas.renderAll();
    };
  
    imgElement.onerror = (error) => {
      console.error('Error loading image:', error);
    };
  };
  
  
  
  
  

  const addTextLayer = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const text = new fabric.IText('Editable Text', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#111827',
      });
      canvas.add(text);
    }
  };

  const addShape = (shapeType) => {
    const canvas = canvasRef.current;
    if (canvas) {
      let shape;
      switch (shapeType) {
        case 'circle':
          shape = new fabric.Circle({ radius: 50, fill: '#3b82f6', left: 100, top: 100 });
          break;
        case 'rectangle':
          shape = new fabric.Rect({ width: 120, height: 80, fill: '#10b981', left: 100, top: 100 });
          break;
        case 'triangle':
          shape = new fabric.Triangle({ width: 100, height: 100, fill: '#ef4444', left: 100, top: 100 });
          break;
        default:
          break;
      }
      canvas.add(shape);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL({ format: 'png' });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'modified-image.png';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-gray-100 text-center mb-8">Image Caption Tool</h1>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto mb-8">
        <input
          type="text"
          className="border border-gray-300 p-3 rounded w-full mb-4 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:text-blue-700 hover:bg-white transition"
          onClick={fetchImages}
        >
          Search
        </button>
      </div>

      {/* Image Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {images.map((image) => (
          <div key={image.id} className="bg-white border relative rounded-lg shadow-md overflow-hidden">
            <img
              src={image.src.medium}
              alt={image.alt}
              className="w-full h-52 object-contain"
            />
            <button
              className="bg-green-500 text-white text-sm px-2 py-1 rounded-md absolute bottom-0 right-0 hover:bg-green-600 transition"
              onClick={() => handleAddToCanvas(image.src.large)}
            >
              Add to Canvas
            </button>
          </div>
        ))}
      </div>

      {/* Canvas Section */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <canvas id="imageCanvas" className="border rounded-md shadow-md"></canvas>
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button
            className="bg-gray-700 text-white px-6 py-3 rounded shadow hover:bg-white hover:text-gray-700 transition duration-300"
            onClick={addTextLayer}
          >
            Add Text
          </button>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded shadow hover:text-red-500 hover:bg-white transition duration-300"
            onClick={() => addShape('circle')}
          >
            Add Circle
          </button>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded shadow hover:text-green-500 hover:bg-white transition duration-300"
            onClick={() => addShape('rectangle')}
          >
            Add Rectangle
          </button>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded shadow hover:text-blue-500 hover:bg-white transition duration-300"
            onClick={() => addShape('triangle')}
          >
            Add Triangle
          </button>
          <button
            className="bg-indigo-600 text-white px-6 py-3 rounded shadow hover:bg-indigo-700 transition"
            onClick={downloadCanvas}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
