import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, Edit, Trash2, Search, Star, Eye } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    namebn: '',
    description: '',
    descriptionbn: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    images: [] as string[],
    tags: [] as string[],
    inStock: true,
    stockQuantity: 0,
    featured: false,
    isCustomizable: false,
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsAddModalOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Product added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest('PUT', `/api/products/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setEditingProduct(null);
      resetForm();
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      namebn: '',
      description: '',
      descriptionbn: '',
      price: '',
      originalPrice: '',
      category: '',
      subcategory: '',
      images: [],
      tags: [],
      inStock: true,
      stockQuantity: 0,
      featured: false,
      isCustomizable: false,
    });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      addProductMutation.mutate(data);
    }
  };

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.namebn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Product Management</h1>
        <Dialog open={isAddModalOpen || !!editingProduct} onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingProduct(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="gold-gradient text-black font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">English Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800 border-gray-600"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="namebn">Bengali Name</Label>
                  <Input
                    id="namebn"
                    value={formData.namebn}
                    onChange={(e) => setFormData({ ...formData, namebn: e.target.value })}
                    className="bg-gray-800 border-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">English Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descriptionbn">Bengali Description</Label>
                <Textarea
                  id="descriptionbn"
                  value={formData.descriptionbn}
                  onChange={(e) => setFormData({ ...formData, descriptionbn: e.target.value })}
                  className="bg-gray-800 border-gray-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (৳)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-gray-800 border-gray-600"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (৳)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-600"
                  />
                </div>
              </div>

              {/* Image Management Section */}
              <div>
                <Label>Product Images</Label>
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        className="bg-gray-800 border-gray-600"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const url = e.currentTarget.value;
                            if (url && !formData.images.includes(url)) {
                              setFormData({ 
                                ...formData, 
                                images: [...formData.images, url] 
                              });
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="imageFile">Upload Image</Label>
                      <Input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        className="bg-gray-800 border-gray-600"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // For now, we'll use a placeholder URL
                            // In production, you'd upload to a service like Cloudinary
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              const result = e.target?.result as string;
                              setFormData({ 
                                ...formData, 
                                images: [...formData.images, result] 
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Product image ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                images: formData.images.filter((_, i) => i !== index)
                              });
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isCustomizable"
                    checked={formData.isCustomizable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isCustomizable: checked })}
                  />
                  <Label htmlFor="isCustomizable">Customizable</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="gold-gradient text-black">
                  {editingProduct ? 'Update' : 'Add'} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="glass-effect border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-400">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-effect border-gray-700 hover:border-gold/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{product.namebn}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        {product.featured && (
                          <Badge className="text-xs bg-gold/20 text-gold">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-gold font-semibold">৳{parseFloat(product.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Stock:</span>
                      <span className={`font-semibold ${product.stockQuantity < 5 ? 'text-red-400' : 'text-green-400'}`}>
                        {product.stockQuantity} units
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <Badge variant={product.inStock ? 'default' : 'destructive'} className="text-xs">
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product)}
                      className="border-gold text-gold hover:bg-gold hover:text-black"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProductMutation.mutate(product.id)}
                      disabled={deleteProductMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="col-span-full glass-effect border-gray-700">
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
              <p className="text-gray-400">No products match your current filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};