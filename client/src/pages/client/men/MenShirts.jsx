import React, { useState, useEffect, useRef } from 'react';
import { Layout, Breadcrumb, Pagination, Spin, message } from 'antd';
import { ChevronRight, Home, Tag } from 'lucide-react';
import { SearchBar, ShirtGrid, SortOptions } from '../../../components';
import { productsAPI } from '../../../utils/api';
const { Content } = Layout;

const MenShirts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [feelType, setFeelType] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); // Show 6 items per page
  const [paginatedProducts, setPaginatedProducts] = useState([]);

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();

        const menPants = response.data.filter(
          product => product.category === 'Men' && product.subcategory.toLowerCase().includes('shirt')
        );
        setProducts(menPants);
        setFilteredProducts(menPants);
      } catch (error) {
        console.error('Error fetching products:', error);
        message.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query and handFeel
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    if (feelType && feelType !== 'All') {
      filtered = filtered.filter(product => product.handFeel === feelType);
    }

    // Sort products based on selected option
    switch (sortOption) {
      case 'newest':
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, feelType, sortOption, products]);

  useEffect(() => {
    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredProducts.slice(startIndex, endIndex);
    setPaginatedProducts(paginatedData);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Content ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6"
          separator={<ChevronRight size={14} className="text-gray-400" />}
          items={[
            {
              title: (
                <div className="flex items-center">
                  <Home size={14} className="mr-1" />
                  <span>Home</span>
                </div>
              ),
              href: '/'
            },
            {
              title: 'Men',
              href: '/men'
            },
            {
              title: (
                <div className="flex items-center">
                  <Tag size={14} className="mr-1" />
                  <span>Shirts</span>
                </div>
              )
            }
          ]}
        />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Men's Shirts</h1>
          <p className="text-gray-600 mt-2">
            Find the perfect shirt for any occasion, from casual to formal.
          </p>
        </div>

        {/* Search & Filter */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          feelType={feelType}
          setFeelType={setFeelType}
        />

        {/* Sort Options */}
        <SortOptions
          sortOption={sortOption}
          setSortOption={setSortOption}
          totalShirts={filteredProducts.length}
        />

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <ShirtGrid productData={paginatedProducts} />
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination
                current={currentPage}
                total={filteredProducts.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                className="bg-white p-4 rounded-lg shadow-sm"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No shirts found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Content>
    </div>
  );
};

export default MenShirts;