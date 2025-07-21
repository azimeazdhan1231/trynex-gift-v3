import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, RotateCw, Move, Type, Image as ImageIcon, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface DesignElement {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content?: string;
  imageUrl?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

interface CanvasEditorProps {
  productId: number;
  productName: string;
  onSave?: (designData: any) => void;
}

export const CanvasEditor = ({ productId, productName, onSave }: CanvasEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const { toast } = useToast();

  const canvasWidth = 400;
  const canvasHeight = 400;

  useEffect(() => {
    drawCanvas();
  }, [elements, selectedElement]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw product mockup background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Add mockup outline
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 50, canvasWidth - 100, canvasHeight - 100);

    // Draw elements
    elements.forEach(element => {
      ctx.save();
      
      // Apply transformations
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
      ctx.rotate(element.rotation * Math.PI / 180);
      ctx.translate(-element.width / 2, -element.height / 2);

      if (element.type === 'text' && element.content) {
        ctx.fillStyle = element.color || '#000000';
        ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
        ctx.fillText(element.content, 0, element.height / 2);
      } else if (element.type === 'image' && element.imageUrl) {
        // For demo purposes, draw a placeholder
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(0, 0, element.width, element.height);
        ctx.strokeStyle = '#9ca3af';
        ctx.strokeRect(0, 0, element.width, element.height);
        
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Image', element.width / 2, element.height / 2);
      }

      // Draw selection outline
      if (selectedElement === element.id) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.strokeRect(-2, -2, element.width + 4, element.height + 4);
        
        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-handleSize/2, -handleSize/2, handleSize, handleSize);
        ctx.fillRect(element.width - handleSize/2, -handleSize/2, handleSize, handleSize);
        ctx.fillRect(-handleSize/2, element.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(element.width - handleSize/2, element.height - handleSize/2, handleSize, handleSize);
      }

      ctx.restore();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on an element
    let clickedElement: DesignElement | null = null;
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (
        x >= element.x &&
        x <= element.x + element.width &&
        y >= element.y &&
        y <= element.y + element.height
      ) {
        clickedElement = element;
        break;
      }
    }

    if (clickedElement) {
      setSelectedElement(clickedElement.id);
      setDragOffset({
        x: x - clickedElement.x,
        y: y - clickedElement.y
      });
    } else {
      setSelectedElement(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedElement) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(prev => prev.map(element => 
      element.id === selectedElement
        ? {
            ...element,
            x: Math.max(0, Math.min(canvasWidth - element.width, x - dragOffset.x)),
            y: Math.max(0, Math.min(canvasHeight - element.height, y - dragOffset.y))
          }
        : element
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const addTextElement = () => {
    if (!textInput.trim()) return;

    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 30,
      rotation: 0,
      content: textInput,
      fontSize: 18,
      color: '#000000',
      fontFamily: 'Arial'
    };

    setElements(prev => [...prev, newElement]);
    setTextInput("");
    setSelectedElement(newElement.id);

    toast({
      title: "Text Added",
      description: "Text element has been added to the design.",
    });
  };

  const addImageElement = (imageUrl: string) => {
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'image',
      x: 120,
      y: 120,
      width: 160,
      height: 160,
      rotation: 0,
      imageUrl
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);

    toast({
      title: "Image Added",
      description: "Image element has been added to the design.",
    });
  };

  const rotateSelectedElement = () => {
    if (!selectedElement) return;

    setElements(prev => prev.map(element => 
      element.id === selectedElement
        ? { ...element, rotation: (element.rotation + 15) % 360 }
        : element
    ));
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;

    setElements(prev => prev.filter(element => element.id !== selectedElement));
    setSelectedElement(null);

    toast({
      title: "Element Deleted",
      description: "Selected element has been removed.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file (JPG, PNG).",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      addImageElement(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const saveDesign = () => {
    const designData = {
      elements,
      canvas: {
        width: canvasWidth,
        height: canvasHeight
      }
    };

    onSave?.(designData);

    toast({
      title: "Design Saved",
      description: "Your custom design has been saved successfully.",
    });
  };

  const downloadPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${productName}-custom-design.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Preview Downloaded",
      description: "Design preview has been downloaded.",
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Canvas */}
      <div className="lg:col-span-2">
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white">Design Canvas - {productName}</CardTitle>
            <p className="text-gray-300 text-sm">
              Click to select, drag to move, and use tools to customize your design.
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 inline-block">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="border border-gray-300 cursor-pointer"
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDragging(false)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Panel */}
      <div className="space-y-4">
        {/* Add Text */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Type className="h-5 w-5" />
              Add Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Enter your text..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="bg-black/50 border-gold/30 text-white"
              rows={3}
            />
            <Button 
              onClick={addTextElement} 
              disabled={!textInput.trim()}
              className="w-full bg-gold text-black hover:bg-gold/90"
            >
              Add Text
            </Button>
          </CardContent>
        </Card>

        {/* Add Image */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Add Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="bg-black/50 border-gold/30 text-white file:bg-gold file:text-black file:border-0 file:rounded file:mr-3"
              />
              <p className="text-xs text-gray-400">
                Upload JPG or PNG files (max 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Element Controls */}
        {selectedElement && (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-white">Element Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={rotateSelectedElement}
                  className="border-gold/30 text-white hover:bg-gold hover:text-black"
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Rotate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedElement}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={saveDesign}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Design
            </Button>
            <Button
              onClick={downloadPreview}
              variant="outline"
              className="w-full border-gold/30 text-white hover:bg-gold hover:text-black"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Preview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
