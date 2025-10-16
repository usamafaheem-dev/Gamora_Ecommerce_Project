import { Button, Badge, Rate } from 'antd';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StoreUse from './Store/StoreUse';
import { useContext } from 'react';
import { AuthContext } from '../routes/AuthProvider';
import { toast } from 'react-toastify';

const ShirtCard = ({ products, onClick }) => {
  const { userRole } = useContext(AuthContext)
  const navigate = useNavigate();
  const { addToCart, toggleFavorite, favorites, setCartOpen } = StoreUse();

  const {
    _id,
    name,
    description,
    price,
    images,
    subcategory,
    material,
    reviewCount = 0,
    reviewAvg = 0
  } = products;

  const isFavorite = favorites.some(fav => fav._id === _id);

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/product/${_id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(products);
    setCartOpen(true);

  };

  const handleToggleFavorite = () => {
    toggleFavorite(products);
  };

  return (
    <div className="group relative rounded-lg flex flex-col justify-between overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative pb-[125%] overflow-hidden" onClick={onClick ? () => onClick(products) : undefined}
        style={onClick ? { cursor: 'pointer' } : {}}>
        <img
          src={`http://localhost:5000${images[0]}`}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />

        {userRole === 'user' && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart
              size={20}
              className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>
        )}

        {/* Category badge */}
        <div className="absolute top-2 left-[14%]">
          <Badge.Ribbon text={subcategory} color="#0F172A" className="font-medium" />
        </div>
        {products.stock === 0 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <div className="flex items-center">
            <Rate
              disabled
              value={reviewCount > 0 ? reviewAvg : 0}
              count={1}
              className="text-amber-500"
            />
            <span className="ml-1 text-sm text-gray-600">
              {reviewCount > 0 ? Number(reviewAvg).toFixed(1) : ''}
            </span>
            <span className="ml-1 text-xs text-gray-400">
              {reviewCount > 0 ? `(${reviewCount})` : 'No reviews'}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">{description}</p>

        <div className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Material:</span> {material}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-gray-900">Rs:{price}</span>
          </div>

          
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<Eye size={16} />}
              onClick={handleViewDetails}
              className="flex items-center  "
            >
              <span className="ml-1">View</span>
            </Button>
            {userRole === 'user' && (

              <Button
                type="primary"
                icon={<ShoppingCart size={16} />}
                onClick={handleAddToCart}
                className="flex items-center bg-[#0F172A] hover:!bg-[#2e3d55e7] disabled:!bg-gray-100 disabled:border border-0"
                disabled={products.stock === 0}
              >
                <span className="ml-1">Add</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShirtCard;