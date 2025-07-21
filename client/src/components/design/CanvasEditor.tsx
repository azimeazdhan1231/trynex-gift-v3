
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, RotateCw, Move, Type, Image as ImageIcon, Save, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";

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
  const [savedDesign, setSavedDesign] = useState<any>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });
  const { toast } = useToast();
  const { addItem } = useCart();

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setCanvasSize({ width: 280, height: 280 });
      } else if (screenWidth < 768) {
        setCanvasSize({ width: 320, height: 320 });
      } else {
        setCanvasSize({ width: 400, height: 400 });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    drawCanvas();
  }, [elements, selectedElement, canvasSize]);

  const getProductMockup = () => {
    const productLower = productName.toLowerCase();
    if (productLower.includes('mug') || productLower.includes('coffee')) {
      return 'mug';
    } else if (productLower.includes('tumbler') || productLower.includes('water')) {
      return 'tumbler';
    } else if (productLower.includes('shirt') || productLower.includes('t-shirt')) {
      return 'tshirt';
    } else if (productLower.includes('frame') || productLower.includes('picture')) {
      return 'frame';
    } else if (productLower.includes('wallet')) {
      return 'wallet';
    }
    return 'generic';
  };

  const drawProductMockup = (ctx: CanvasRenderingContext2D) => {
    const mockupType = getProductMockup();
    const { width, height } = canvasSize;
    
    // Clear background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Define design area (where custom content goes)
    const designArea = {
      x: width * 0.25,
      y: height * 0.25,
      width: width * 0.5,
      height: height * 0.5
    };

    switch (mockupType) {
      case 'mug':
        // Draw mug outline
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        
        // Mug body
        ctx.beginPath();
        ctx.roundRect(width * 0.2, height * 0.15, width * 0.6, height * 0.7, 20);
        ctx.fill();
        ctx.stroke();
        
        // Mug handle
        ctx.beginPath();
        ctx.arc(width * 0.85, height * 0.4, 25, Math.PI * 0.3, Math.PI * 1.7, false);
        ctx.stroke();
        
        // Design area highlight
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(designArea.x, designArea.y, designArea.width, designArea.height);
        ctx.setLineDash([]);
        break;

      case 'tumbler':
        // Draw tumbler outline
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        
        // Tumbler body (cylindrical)
        ctx.beginPath();
        ctx.roundRect(width * 0.3, height * 0.1, width * 0.4, height * 0.8, 15);
        ctx.fill();
        ctx.stroke();
        
        // Cap
        ctx.beginPath();
        ctx.roundRect(width * 0.28, height * 0.08, width * 0.44, height * 0.08, 8);
        ctx.fill();
        ctx.stroke();
        
        // Design area
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(designArea.x, designArea.y, designArea.width, designArea.height);
        ctx.setLineDash([]);
        break;

      case 'tshirt':
        // Draw t-shirt outline
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        
        // T-shirt body
        ctx.beginPath();
        ctx.roundRect(width * 0.15, height * 0.25, width * 0.7, height * 0.65, 20);
        ctx.fill();
        ctx.stroke();
        
        // Sleeves
        ctx.beginPath();
        ctx.roundRect(width * 0.05, height * 0.2, width * 0.15, height * 0.3, 10);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.roundRect(width * 0.8, height * 0.2, width * 0.15, height * 0.3, 10);
        ctx.fill();
        ctx.stroke();
        
        // Neck
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.25, width * 0.08, 0, Math.PI, false);
        ctx.stroke();
        
        // Design area
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(width * 0.35, height * 0.4, width * 0.3, height * 0.25);
        ctx.setLineDash([]);
        break;

      case 'frame':
        // Draw picture frame
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 8;
        ctx.fillStyle = '#ffffff';
        
        // Frame border
        ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
        ctx.fillRect(width * 0.15, height * 0.15, width * 0.7, height * 0.7);
        
        // Design area (inner frame)
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
        ctx.setLineDash([]);
        break;

      default:
        // Generic product
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        ctx.roundRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8, 15);
        ctx.fill();
        ctx.stroke();
        
        // Design area
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(designArea.x, designArea.y, designArea.width, designArea.height);
        ctx.setLineDash([]);
        break;
    }

    return designArea;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Draw product mockup and get design area
    const designArea = drawProductMockup(ctx);

    // Draw elements within design area
    elements.forEach(element => {
      ctx.save();
      
      // Constrain elements to design area
      const constrainedX = Math.max(designArea.x, Math.min(designArea.x + designArea.width - element.width, element.x));
      const constrainedY = Math.max(designArea.y, Math.min(designArea.y + designArea.height - element.height, element.y));
      
      // Apply transformations
      ctx.translate(constrainedX + element.width / 2, constrainedY + element.height / 2);
      ctx.rotate(element.rotation * Math.PI / 180);
      ctx.translate(-element.width / 2, -element.height / 2);

      if (element.type === 'text' && element.content) {
        ctx.fillStyle = element.color || '#000000';
        ctx.font = `${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.fillText(element.content, element.width / 2, element.height / 2);
      } else if (element.type === 'image' && element.imageUrl) {
        // Draw uploaded image
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, element.width, element.height);
        };
        img.src = element.imageUrl;
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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setElements(prev => prev.map(element => 
      element.id === selectedElement
        ? {
            ...element,
            x: Math.max(canvasSize.width * 0.25, Math.min(canvasSize.width * 0.75 - element.width, x - dragOffset.x)),
            y: Math.max(canvasSize.height * 0.25, Math.min(canvasSize.height * 0.75 - element.height, y - dragOffset.y))
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
      x: canvasSize.width * 0.35,
      y: canvasSize.height * 0.4,
      width: 100,
      height: 30,
      rotation: 0,
      content: textInput,
      fontSize: 16,
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
      x: canvasSize.width * 0.3,
      y: canvasSize.height * 0.35,
      width: 80,
      height: 80,
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
        width: canvasSize.width,
        height: canvasSize.height
      },
      productName,
      productId
    };

    setSavedDesign(designData);
    onSave?.(designData);

    toast({
      title: "Design Saved",
      description: "Your custom design has been saved successfully.",
    });
  };

  const addToCart = () => {
    if (!savedDesign) {
      toast({
        title: "Save Design First",
        description: "Please save your design before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `Custom ${productName}`,
      namebn: `কাস্টম ${productName}`,
      price: 299,
      pricebn: "২৯৯",
      description: "Custom designed product with your personal touch",
      descriptionbn: "আপনার ব্যক্তিগত ছোঁয়া সহ কাস্টম ডিজাইন পণ্য",
      image: canvasRef.current?.toDataURL() || "/placeholder.jpg",
      category: "Custom",
      inStock: true,
      customDesign: savedDesign
    };

    addItem(customProduct);

    toast({
      title: "Added to Cart!",
      description: "Your custom product has been added to cart.",
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
            <div className="bg-white rounded-lg p-4 inline-block max-w-full overflow-auto">
              <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="border border-gray-300 cursor-pointer max-w-full h-auto"
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
              onClick={addToCart}
              disabled={!savedDesign}
              className="w-full bg-gold hover:bg-gold/90 text-black"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
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
