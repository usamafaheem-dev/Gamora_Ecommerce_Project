import React, { useState, useEffect, useRef } from 'react';
import { Layout, Breadcrumb, Pagination, Spin, message } from 'antd';
import { ChevronRight, Home, Tag } from 'lucide-react';
import { SearchBar, ShirtGrid, SortOptions } from '../../../components';
import { productsAPI } from '../../../utils/api';
const { Content } = Layout;

const subcategoryRoutes = {
  shirt: '/women/shirts',
  pants: '/women/pants',
  shoes: '/women/shoes',
};

function getSubcategoryRoute(subcategory) {
  if (!subcategory) return '/women';
  const sub = subcategory.toLowerCase();
  if (sub.includes('shirt')) return subcategoryRoutes.shirt;
  if (sub.includes('pant')) return subcategoryRoutes.pants;
  if (sub.includes('shoe')) return subcategoryRoutes.shoes;
  return '/women';
}

const WomenProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [feelType, setFeelType] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [paginatedProducts, setPaginatedProducts] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        const all = response.data.filter(p => p.category === 'Women');
        const shirts = all.filter(p => p.subcategory && p.subcategory.toLowerCase().includes('shirt')).slice(0, 3);
        const pants = all.filter(p => p.subcategory && p.subcategory.toLowerCase().includes('pant')).slice(0, 3);
        const shoes = all.filter(p => p.subcategory && p.subcategory.toLowerCase().includes('shoe')).slice(0, 3);
        // Mix and shuffle
        let mixed = [...shirts, ...pants, ...shoes];
        mixed = mixed.sort(() => Math.random() - 0.5);
        setProducts(mixed);
        setFilteredProducts(mixed);
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
        // Optionally implement rating sort
        break;
      default:
        break;
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, feelType, sortOption, products]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleProductClick = (product) => {
    window.location.href = getSubcategoryRoute(product.subcategory);
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
                  <span>Featured</span>
                </div>
              )
            }
          ]}
        />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Men's Featured Products</h1>
          <p className="text-gray-600 mt-2">
            Explore a mix of top shirts, pants, and shoes for men.
          </p>
        </div>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          feelType={feelType}
          setFeelType={setFeelType}
        />
        <SortOptions
          sortOption={sortOption}
          setSortOption={setSortOption}
          totalShirts={filteredProducts.length}
        />
        {paginatedProducts.length > 0 ? (
          <>
            <ShirtGrid productData={paginatedProducts} onClick={handleProductClick} />
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
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Content>
    </div>
  );
};

export default WomenProducts;

