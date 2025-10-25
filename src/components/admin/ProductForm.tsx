"use client";

import {
  Product,
  ProductVariant,
  ProductSpecification,
} from "../../types/product";
import { useState, useRef, useEffect } from "react";

interface ProductFormProps {
  product?: Product;
}

interface MediaFile {
  file?: File;
  preview: string;
  type: "image" | "video";
  name?: string;
  url?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  parentId: string | null;
  slug: string;
  children?: Category[];
}

interface Attribute {
  name: string;
  values: string[];
}

export default function ProductForm({ product }: ProductFormProps) {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    categories: [] as string[],
    image: "",
    inStock: true,
    rating: 0,
    todayOffer: false,
    FeaturedProduct: false,
    discountPrice: 0,
    type: "simple" as "simple" | "variable",
    sku: "",
    brand: "",
    stockQuantity: 0,
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    shippingClass: "",
    hasGuarantee: false,
    hasReferal: false,
    hasChange: false,
    seoTitle: "",
    seoDescription: "",
    attributes: [] as Attribute[],
    specifications: [] as ProductSpecification[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalMedia, setAdditionalMedia] = useState<MediaFile[]>([]);
  const [mediaToRemove, setMediaToRemove] = useState<{ url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  // Variations state
  const [variations, setVariations] = useState<ProductVariant[]>([]);
  const [editingVariationIndex, setEditingVariationIndex] = useState<
    number | null
  >(null);

  // Attributes state for variable products
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  // Add these functions inside your component

  // Handle variant image change
  const handleVariantImageChange = (
    variationIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file for the variant");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("Variant image size should be less than 5MB");
        return;
      }

      // Create a blob URL for preview
      const previewUrl = URL.createObjectURL(file);

      // Update the variation with the new image file and preview
      setVariations((prev) =>
        prev.map((variation, index) =>
          index === variationIndex
            ? {
                ...variation,
                imageFile: file,
                imagePreview: previewUrl, // Use this for preview
                // Keep the original image URL if it exists (for editing existing variants)
                image: variation.image, // Don't overwrite the stored URL with blob URL
              }
            : variation
        )
      );
    }
  };

  const removeVariantImage = (variationIndex: number) => {
    setVariations((prev) =>
      prev.map((variation, index) => {
        if (index === variationIndex) {
          // Revoke the blob URL to prevent memory leaks
          if (variation.imagePreview) {
            URL.revokeObjectURL(variation.imagePreview);
          }
          return {
            ...variation,
            imageFile: undefined,
            imagePreview: undefined,
            image: "", // Clear the stored URL as well
          };
        }
        return variation;
      })
    );
  };
  useEffect(() => {
    if (selectedCategories.length === 0 || expandedCategories.size > 0) return;

    const newExpanded = new Set<string>();

    const findAndExpandParents = (cats: Category[]): boolean => {
      let shouldExpand = false;
      cats.forEach((cat) => {
        let hasSelectedInBranch = selectedCategories.includes(cat._id);
        if (cat.children?.length) {
          const childHasSelected = findAndExpandParents(cat.children);
          if (childHasSelected) {
            hasSelectedInBranch = true;
            newExpanded.add(cat._id);
          }
        }
        if (hasSelectedInBranch) shouldExpand = true;
      });
      return shouldExpand;
    };

    findAndExpandParents(categories);
    setExpandedCategories(newExpanded);
  }, [categories, selectedCategories]);

  useEffect(() => {
    console.log("Variations state updated:", variations);
  }, [variations]);

  useEffect(() => {
    console.log(
      "🔄 ProductForm useEffect - Initializing with product:",
      product
    );
    setIsClient(true);

    // Initialize form data with product data
    if (product) {
      console.log("📦 Initializing form with product data:", {
        name: product.name,
        featuredProduct: product.featuredProduct,
        additionalMedia: product.additionalMedia,
      });

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        discountPrice: product.discountPrice || 0,
        categories: product.categories || [],
        image: product.image || "",
        inStock: product.inStock ?? true,
        rating: product.rating || 0,
        todayOffer: product.todayOffer || false,
        FeaturedProduct: product.featuredProduct || false, // Fixed: map featuredProduct to FeaturedProduct
        type: product.type || "simple",
        sku: product.sku || "",
        brand: product.brand || "",
        stockQuantity: product.stockQuantity || 0,
        weight: product.weight || 0,
        dimensions: product.dimensions || { width: 0, height: 0, depth: 0 },
        shippingClass: product.shippingClass || "",
        hasGuarantee: product.hasGuarantee || false,
        hasReferal: product.hasReferal || false,
        hasChange: product.hasChange || false,
        seoTitle: product.seoTitle || "",
        seoDescription: product.seoDescription || "",
        attributes: product.attributes || [],
        specifications: product.specifications || [],
      });

      // Initialize variations if product is variable
      if (product.type === "variable" && product.variants) {
        console.log("🔄 Initializing variations:", product.variants.length);
        const initializedVariants = product.variants.map((variant) => ({
          ...variant,
          imageFile: undefined,
          imagePreview: undefined,
        }));
        setVariations(initializedVariants);
      }

      // Initialize attributes
      if (product.attributes) {
        setAttributes(product.attributes);
      }

      // Initialize selected categories
      if (product.categories && product.categories.length > 0) {
        setSelectedCategories(product.categories);
      }

      // Load existing additional media
      if (product.additionalMedia && product.additionalMedia.length > 0) {
        console.log("🖼️ Loading additional media:", product.additionalMedia);
        const existingMedia: MediaFile[] = product.additionalMedia.map(
          (media) => ({
            preview: media.url,
            type: media.type,
            name: media.name || media.url.split("/").pop() || "Media file",
            url: media.url,
          })
        );
        setAdditionalMedia(existingMedia);
      }
    } else {
      console.log("❌ No product data provided to ProductForm");
    }

    // Fetch categories
    fetchCategories();
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      setFormData((prevFormData) => ({
        ...prevFormData,
        categories: newSelection,
      }));

      return newSelection;
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as "simple" | "variable";
    setFormData((prev) => ({
      ...prev,
      type: newType,
    }));

    // Reset variations and specifications when switching product type
    if (newType === "simple") {
      setVariations([]);
      setAttributes([]);
    } else {
      setFormData((prev) => ({
        ...prev,
        specifications: [],
      }));
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        return;
      }

      setMainImageFile(file);
    }
  };

  const handleAdditionalMediaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setMessage("Please select only image or video files");
        return;
      }

      const maxSize = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage(
          `${isImage ? "Image" : "Video"} size should be less than ${
            maxSize / (1024 * 1024)
          }MB`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newMedia: MediaFile = {
          file,
          preview: e.target?.result as string,
          type: isImage ? "image" : "video",
          name: file.name,
        };
        setAdditionalMedia((prev) => [...prev, newMedia]);
      };
      reader.readAsDataURL(file);
    });

    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }
  };

  const removeAdditionalMedia = (index: number) => {
    const media = additionalMedia[index];

    if (media.url && !media.file) {
      setMediaToRemove((prev) => [...prev, { url: media.url! }]);
    }

    setAdditionalMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Attribute management functions
  const addAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", values: [] }]);
  };

  const updateAttribute = (index: number, field: string, value: any) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr))
    );
  };

  const updateAttributeValues = (index: number, values: string) => {
    const valueArray = values
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === index ? { ...attr, values: valueArray } : attr
      )
    );
  };

  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate combinations from attributes
  const generateCombinations = () => {
    if (
      attributes.length === 0 ||
      attributes.some((attr) => !attr.name || attr.values.length === 0)
    ) {
      setMessage("Please define at least one attribute with values.");
      return;
    }

    const combinations: string[][] = [[]];
    attributes.forEach((attr) => {
      const newCombinations: string[][] = [];
      attr.values.forEach((value) => {
        combinations.forEach((combo) => {
          newCombinations.push([...combo, value]);
        });
      });
      combinations.length = 0;
      combinations.push(...newCombinations);
    });

    const newVariations: ProductVariant[] = combinations.map((combo) => {
      const name = combo.join(" - ");
      return {
        _id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        sku: "",
        price: formData.price || 0,
        discountPrice: formData.discountPrice || 0,
        inStock: true,
        stockQuantity: 0,
        specifications: [],
        image: "",
        additionalMedia: [],
        attributes: combo.map((value, index) => ({
          name: attributes[index].name,
          value,
        })),
      };
    });

    setVariations(newVariations);
    setFormData((prev) => ({
      ...prev,
      attributes,
    }));
    setMessage("Variations generated successfully!");
  };

  // Variation management functions
  const addVariation = () => {
    const newVariation: ProductVariant = {
      _id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      sku: "",
      price: formData.price || 0,
      discountPrice: formData.discountPrice || 0,
      inStock: true,
      stockQuantity: 0,
      specifications: [],
      image: "",
      additionalMedia: [],
      attributes: [],
    };
    setVariations((prev) => [...prev, newVariation]);
    setEditingVariationIndex(variations.length);
  };

  const updateVariation = (index: number, field: string, value: any) => {
    setVariations((prev) =>
      prev.map((variation, i) =>
        i === index ? { ...variation, [field]: value } : variation
      )
    );
  };

  const updateVariationSpecification = (
    variationIndex: number,
    specIndex: number,
    field: string,
    value: string
  ) => {
    setVariations((prev) =>
      prev.map((variation, i) => {
        if (i === variationIndex) {
          const updatedSpecifications = variation.specifications.map(
            (spec, j) => (j === specIndex ? { ...spec, [field]: value } : spec)
          );
          return { ...variation, specifications: updatedSpecifications };
        }
        return variation;
      })
    );
  };

  const addSpecificationToVariation = (variationIndex: number) => {
    setVariations((prev) =>
      prev.map((variation, i) => {
        if (i === variationIndex) {
          return {
            ...variation,
            specifications: [
              ...variation.specifications,
              { key: "", value: "" },
            ],
          };
        }
        return variation;
      })
    );
  };

  const removeSpecificationFromVariation = (
    variationIndex: number,
    specIndex: number
  ) => {
    setVariations((prev) =>
      prev.map((variation, i) => {
        if (i === variationIndex) {
          return {
            ...variation,
            specifications: variation.specifications.filter(
              (_, j) => j !== specIndex
            ),
          };
        }
        return variation;
      })
    );
  };

  const removeVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
    if (editingVariationIndex === index) {
      setEditingVariationIndex(null);
    } else if (editingVariationIndex && editingVariationIndex > index) {
      setEditingVariationIndex(editingVariationIndex - 1);
    }
  };

  // Specification management for simple products
  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (
    specIndex: number,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === specIndex ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (specIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== specIndex),
    }));
  };

  // Remove this useEffect from inside handleSubmit and place it at the component level:

  // Clean up blob URLs on component unmount
  useEffect(() => {
    return () => {
      // Clean up all blob URLs when component unmounts
      variations.forEach((variation) => {
        if (variation.imagePreview) {
          URL.revokeObjectURL(variation.imagePreview);
        }
      });
    };
  }, [variations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate at least one category is selected
    if (selectedCategories.length === 0) {
      setMessage("Please select at least one category");
      setLoading(false);
      return;
    }

    // Validate discount price is not greater than regular price for simple products
    if (formData.type === "simple" && formData.discountPrice > formData.price) {
      setMessage("Discount price cannot be greater than regular price");
      setLoading(false);
      return;
    }

    // Validate variations for variable products
    if (formData.type === "variable" && variations.length === 0) {
      setMessage("Please add at least one variation for variable products");
      setLoading(false);
      return;
    }

    // Validate each variation
    if (formData.type === "variable") {
      for (const variation of variations) {
        if (!variation.name?.trim()) {
          setMessage(
            `Variation "${variation.name || "Unnamed"}" must have a name`
          );
          setLoading(false);
          return;
        }
        if (variation.price <= 0) {
          setMessage(
            `Variation "${variation.name}" must have a price greater than 0`
          );
          setLoading(false);
          return;
        }
      }
    }

    try {
      const formDataToSend = new FormData();

      // Append main form data
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("discountPrice", formData.discountPrice.toString());
      formDataToSend.append("categories", JSON.stringify(selectedCategories));
      formDataToSend.append("inStock", formData.inStock.toString());
      formDataToSend.append("rating", formData.rating.toString());
      formDataToSend.append("type", formData.type);
      formDataToSend.append("sku", formData.sku);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("stockQuantity", formData.stockQuantity.toString());
      formDataToSend.append("weight", formData.weight.toString());
      formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));
      formDataToSend.append("shippingClass", formData.shippingClass);
      formDataToSend.append("hasGuarantee", formData.hasGuarantee.toString());
      formDataToSend.append("hasReferal", formData.hasReferal.toString());
      formDataToSend.append("hasChange", formData.hasChange.toString());
      formDataToSend.append("seoTitle", formData.seoTitle);
      formDataToSend.append("seoDescription", formData.seoDescription);
      formDataToSend.append("attributes", JSON.stringify(formData.attributes));
      formDataToSend.append(
        "specifications",
        JSON.stringify(formData.specifications)
      );

      // Append variations for variable products
      if (formData.type === "variable") {
        // Prepare variants data with image information
        const variantsData = variations.map((variation, index) => {
          const variantData = {
            _id: variation._id,
            name: variation.name,
            sku: variation.sku,
            price: variation.price,
            discountPrice: variation.discountPrice,
            inStock: variation.inStock,
            stockQuantity: variation.stockQuantity,
            specifications: variation.specifications,
            image: variation.image, // Keep existing image URL
            additionalMedia: variation.additionalMedia,
            attributes: variation.attributes,
            // Add a flag to indicate if there's a new image
            hasNewImage: !!variation.imageFile,
          };

          return variantData;
        });

        // Append the variants as JSON
        formDataToSend.append("variants", JSON.stringify(variantsData));

        // Append variant images with proper naming
        variations.forEach((variation, index) => {
          if (variation.imageFile) {
            // Use a consistent naming convention that the backend can parse
            formDataToSend.append(`variantImage-${index}`, variation.imageFile);
          }
        });

        console.log(`Sending ${variations.length} variations with images`);
      }

      // Append main image - either file or URL
      if (mainImageFile) {
        formDataToSend.append("mainImage", mainImageFile);
      } else if (formData.image) {
        formDataToSend.append("imageUrl", formData.image);
      }

      // Append additional media files
      additionalMedia.forEach((media, index) => {
        if (media.file) {
          formDataToSend.append("mediaFiles", media.file);
        }
      });

      if (product && mediaToRemove.length > 0) {
        formDataToSend.append("mediaToRemove", JSON.stringify(mediaToRemove));
      }

      // Debug: Log what's being sent
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name}, Size: ${value.size} bytes`);
        } else {
          console.log(key, value);
        }
      }

      const url = product
        ? `/api/admin/products/${product._id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(
          product
            ? "Product updated successfully!"
            : "Product created successfully!"
        );

        if (!product) {
          // Reset form for new product
          setFormData({
            name: "",
            description: "",
            price: 0,
            discountPrice: 0,
            categories: [],
            image: "",
            inStock: true,
            rating: 0,
            todayOffer: false,
            FeaturedProduct: false,
            type: "simple",
            sku: "",
            brand: "",
            stockQuantity: 0,
            weight: 0,
            dimensions: { width: 0, height: 0, depth: 0 },
            shippingClass: "",
            hasGuarantee: false,
            hasReferal: false,
            hasChange: false,
            seoTitle: "",
            seoDescription: "",
            attributes: [],
            specifications: [],
          });
          setSelectedCategories([]);
          setMainImageFile(null);
          setAdditionalMedia([]);
          setMediaToRemove([]);
          setVariations([]);
          setAttributes([]);
          setEditingVariationIndex(null);
        }
      } else {
        setMessage(
          `Failed to save product: ${responseData.error || "Unknown error"}`
        );
        console.error("Server response:", responseData);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage(
        `Error saving product: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle discount price validation
    if (name === "discountPrice") {
      const discountPrice = parseFloat(value) || 0;
      const price = formData.price;

      if (discountPrice > price) {
        setMessage("Discount price cannot be greater than regular price");
        return;
      } else {
        setMessage("");
      }
    }

    // Handle price change - if price is reduced below discount price, adjust discount price
    if (name === "price") {
      const newPrice = parseFloat(value) || 0;
      const discountPrice = formData.discountPrice;

      if (discountPrice > newPrice) {
        setFormData((prev) => ({
          ...prev,
          [name]: newPrice,
          discountPrice: newPrice,
        }));
        setMessage(
          "Discount price has been adjusted to not exceed the new regular price"
        );
        return;
      }
    }

    // Handle dimensions changes
    if (name.startsWith("dimensions.")) {
      const dimensionField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimensionField]: parseFloat(value) || 0,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  // Helper function to get category names by IDs
  const getCategoryNames = (categoryIds: string[]) => {
    const findCategory = (cats: Category[], id: string): Category | null => {
      for (const cat of cats) {
        if (cat._id === id) return cat;
        if (cat.children) {
          const found = findCategory(cat.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    return categoryIds.map((id) => {
      const category = findCategory(categories, id);
      return category ? category.name : "Unknown Category";
    });
  };

  const CategoryList = ({
    categories,
    level = 0,
    expandedCategories,
    setExpandedCategories,
  }: {
    categories: Category[];
    level?: number;
    expandedCategories: Set<string>;
    setExpandedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  }) => {
    const toggleCategory = (categoryId: string) => {
      setExpandedCategories((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(categoryId)) newSet.delete(categoryId);
        else newSet.add(categoryId);
        return newSet;
      });
    };

    return (
      <div
        className={`${level > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""}`}
      >
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category._id);
          const hasChildren = category.children && category.children.length > 0;

          return (
            <div key={category._id} className="mb-1">
              <div className="flex items-center justify-between group hover:bg-gray-50 rounded-lg transition-colors">
                <label className="flex items-center space-x-3 flex-1 cursor-pointer py-2 px-3 min-h-10">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryToggle(category._id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded border-gray-300"
                  />
                  <span
                    className={`text-sm font-medium ${
                      selectedCategories.includes(category._id)
                        ? "text-indigo-700"
                        : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </span>
                </label>

                {hasChildren && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(category._id);
                    }}
                    className="mr-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        isExpanded ? "rotate-90 text-gray-600" : "text-gray-400"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {hasChildren && isExpanded && (
                <div className="mt-1 ml-2">
                  <CategoryList
                    categories={category.children || []}
                    level={level + 1}
                    expandedCategories={expandedCategories}
                    setExpandedCategories={setExpandedCategories}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Type Selector */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="simple"
                  checked={formData.type === "simple"}
                  onChange={handleTypeChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Simple Product
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="variable"
                  checked={formData.type === "variable"}
                  onChange={handleTypeChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Variable Product
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories *
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="w-full p-2 border border-gray-300 rounded-md text-left bg-white hover:bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} categories selected`
                  : "Select Categories"}
              </button>
              {selectedCategories.length > 0 && (
                <div className="text-sm text-gray-600">
                  <strong>Selected:</strong>{" "}
                  {getCategoryNames(selectedCategories).join(", ")}
                </div>
              )}
            </div>
          </div>
          {/* Specifications for Simple Products */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Specifications
              </label>
              <button
                type="button"
                onClick={addSpecification}
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                + Add Specification
              </button>
            </div>
            {formData.specifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                No specifications added. Click "Add Specification" to add
                product attributes.
              </p>
            ) : (
              <div className="space-y-2">
                {formData.specifications.map((spec, specIndex) => (
                  <div key={specIndex} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Key (e.g., Material)"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecification(specIndex, "key", e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., Cotton)"
                      value={spec.value}
                      onChange={(e) =>
                        updateSpecification(specIndex, "value", e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(specIndex)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Simple Product Fields */}
          {formData.type === "simple" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max={formData.price}
                  className={`w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                    formData.discountPrice > formData.price
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formData.discountPrice > formData.price && (
                  <p className="mt-1 text-sm text-red-600">
                    Discount price cannot exceed regular price ($
                    {formData.price})
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Variable Product Attributes and Variations */}
          {formData.type === "variable" && (
            <div className="md:col-span-2">
              {/* Attributes Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Attributes
                  </label>
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    + Add Attribute
                  </button>
                </div>

                {attributes.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No attributes
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add attributes like Color or Size to generate variations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attributes.map((attr, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Attribute Name (e.g., Color)"
                          value={attr.name}
                          onChange={(e) =>
                            updateAttribute(index, "name", e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          placeholder="Values (e.g., Red, Blue)"
                          value={attr.values.join(", ")}
                          onChange={(e) =>
                            updateAttributeValues(index, e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttribute(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={generateCombinations}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Generate Variations from Attributes
                    </button>
                  </div>
                )}
              </div>

              {variations.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No variations
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding attributes or variations manually.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {variations.map((variation, index) => (
                    <div
                      key={variation._id}
                      className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                    >
                      {/* Variant Image Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Variant Image
                        </label>
                        <div className="space-y-4">
                          <input
                            type="file"
                            onChange={(e) => handleVariantImageChange(index, e)}
                            accept="image/*"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />

                          {(variation.imagePreview || variation.image) && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600 mb-2">
                                Preview:
                              </p>
                              <div className="relative inline-block">
                                <img
                                  src={
                                    variation.imagePreview || variation.image
                                  }
                                  alt={`${variation.name} preview`}
                                  className="h-32 w-32 object-cover rounded-md border"
                                  onError={(e) => {
                                    console.error(
                                      "Failed to load variant image preview"
                                    );
                                    // Only hide if it's a blob URL that failed
                                    if (variation.imagePreview) {
                                      e.currentTarget.style.display = "none";
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeVariantImage(index)}
                                  className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                  title="Remove image"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {variation.imagePreview
                                  ? "New image (not saved yet)"
                                  : "Saved image"}
                              </p>
                            </div>
                          )}

                          {!variation.imagePreview && !variation.image && (
                            <div className="text-sm text-gray-500 italic">
                              No image selected for this variant
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Variation {index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeVariation(index)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Variation Name *
                          </label>
                          <input
                            type="text"
                            value={variation.name}
                            onChange={(e) =>
                              updateVariation(index, "name", e.target.value)
                            }
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Red - Large"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU
                          </label>
                          <input
                            type="text"
                            value={variation.sku}
                            onChange={(e) =>
                              updateVariation(index, "sku", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., PROD-RED-L"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                          </label>
                          <input
                            type="number"
                            value={variation.price}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            required
                            step="0.01"
                            min="0.01"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Price
                          </label>
                          <input
                            type="number"
                            value={variation.discountPrice || 0}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                "discountPrice",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            step="0.01"
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                          </label>
                          <input
                            type="number"
                            value={variation.stockQuantity}
                            onChange={(e) =>
                              updateVariation(
                                index,
                                "stockQuantity",
                                parseInt(e.target.value) || 0
                              )
                            }
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={variation.inStock}
                              onChange={(e) =>
                                updateVariation(
                                  index,
                                  "inStock",
                                  e.target.checked
                                )
                              }
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              In Stock
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Specifications */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Specifications
                          </label>
                          <button
                            type="button"
                            onClick={() => addSpecificationToVariation(index)}
                            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                          >
                            + Add Specification
                          </button>
                        </div>
                        {variation.specifications.map((spec, specIndex) => (
                          <div key={specIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="Key (e.g., Color)"
                              value={spec.key}
                              onChange={(e) =>
                                updateVariationSpecification(
                                  index,
                                  specIndex,
                                  "key",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                              type="text"
                              placeholder="Value (e.g., Blue)"
                              value={spec.value}
                              onChange={(e) =>
                                updateVariationSpecification(
                                  index,
                                  specIndex,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeSpecificationFromVariation(
                                  index,
                                  specIndex
                                )
                              }
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md border border-red-200"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {variation.specifications.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-md">
                            No specifications added. Click "Add Specification"
                            to add variant attributes.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rest of the form fields remain the same */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Additional Fields */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (cm)
              </label>
              <input
                type="number"
                name="dimensions.width"
                value={formData.dimensions.width}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                name="dimensions.height"
                value={formData.dimensions.height}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Depth (cm)
              </label>
              <input
                type="number"
                name="dimensions.depth"
                value={formData.dimensions.depth}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Class
              </label>
              <input
                type="text"
                name="shippingClass"
                value={formData.shippingClass}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* SEO Fields */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Main Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image *
            </label>
            <div className="space-y-4">
              <input
                type="file"
                ref={mainImageInputRef}
                onChange={handleMainImageChange}
                accept="image/*"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />

              {mainImageFile && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>File selected:</strong> {mainImageFile.name}
                  </p>
                </div>
              )}

              {(formData.image || mainImageFile) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={
                      mainImageFile
                        ? URL.createObjectURL(mainImageFile)
                        : formData.image
                    }
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-md border"
                    onError={(e) => {
                      console.error("Failed to load image preview");
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Media Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Media (Images & Videos)
            </label>
            <div className="space-y-4">
              <input
                type="file"
                ref={mediaInputRef}
                onChange={handleAdditionalMediaChange}
                accept="image/*,video/*"
                multiple
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />

              {additionalMedia.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Additional Media Preview:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {additionalMedia.map((media, index) => (
                      <div key={index} className="relative group">
                        {media.type === "image" ? (
                          <img
                            src={media.preview}
                            alt={`Additional media ${index + 1}`}
                            className="h-24 w-full object-cover rounded-md border shadow-sm"
                          />
                        ) : (
                          <div className="relative">
                            <video
                              src={media.preview}
                              className="h-24 w-full object-cover rounded-md border shadow-sm"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-md flex items-start justify-end p-1">
                          <button
                            type="button"
                            onClick={() => removeAdditionalMedia(index)}
                            className="p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform scale-90 group-hover:scale-100"
                            title="Remove media"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="mt-1 text-xs text-gray-500 truncate">
                          {media.name || `Media ${index + 1}`}
                          <span className="ml-1 text-xs px-1 py-0.5 bg-gray-100 rounded">
                            {media.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-sm text-gray-600">
                    <p>
                      Total: {additionalMedia.length} file(s) -
                      {additionalMedia.filter((m) => m.type === "image").length}{" "}
                      image(s),
                      {
                        additionalMedia.filter((m) => m.type === "video").length
                      }{" "}
                      video(s)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Checkbox Options */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="todayOffer"
                checked={formData.todayOffer}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Today's Offer</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="FeaturedProduct"
                checked={formData.FeaturedProduct}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Featured Product
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hasGuarantee"
                checked={formData.hasGuarantee}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Has Guarantee</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hasReferal"
                checked={formData.hasReferal}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Has Referral</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="hasChange"
                checked={formData.hasChange}
                onChange={handleChange}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Has Change</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <a
            href="/admin/products"
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading
              ? product
                ? "Updating..."
                : "Creating..."
              : product
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.includes("success")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Select Categories
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Choose multiple categories for this product
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {categories.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No categories found. Please create categories first.
                </div>
              ) : (
                <CategoryList
                  categories={categories}
                  expandedCategories={expandedCategories}
                  setExpandedCategories={setExpandedCategories}
                />
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedCategories.length} categories selected
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
