import React, { useState } from 'react';
import { Modal, Descriptions, Image, Row, Col } from 'antd';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ src, alt, style, fallback, onError, onClick }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px',
  });

  return (
    <div className="!w-full" ref={ref}>
      {inView ? (
        <Image
          src={src}
          alt={alt}
          style={style}
          fallback={fallback}
          preview={false}
          onError={(e) => {
            console.error(`Failed to load image: ${src}`);
            onError(e);
          }}
          onClick={onClick}
          className="!size-full"
        />
      ) : (
        <div style={{ ...style, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

const ViewModal = ({ visible, product, onCancel }) => {
  const [previewImage, setPreviewImage] = useState(null);

  if (!product) return null;

  const baseUrl = 'http://localhost:5000';
  const imageUrls = (product.images || []).map(image => {
    const original = image.startsWith('http') ? image : `${baseUrl}${image}`;
    const thumb = original.replace('.jpg', '_thumb.jpg');
    return { thumb, original };
  });

  const handlePreview = (original) => {
    setPreviewImage(original);
  };

  const handleImageError = (e, original) => {
    e.target.src = original;
  };

  return (
    <Modal
      title={<>
        <div className=' flex xs:flex-col xs:items-start items-center   gap-2'>
          <h2 className=" m-0 font-semibold">Product Details:</h2>
          <h6 className=" text-blue-500"> {product.name}</h6>

        </div>
        <p className="text-sm text-gray-500">ID: {product._id?.slice(-6)}</p>
      </>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      centered
      className="view-product-modal"
    >
      <Row gutter={[16, 16]} className="mt-3">
        <Col md={8} xs={24}>
          <h3 className="text-lg font-semibold text-[#1677ff] mb-2">Images:</h3>
          <div
             className='modal-scroll'
          >
            {imageUrls.length > 0 ? (
              imageUrls.map((url, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <LazyImage
                    src={url.thumb}
                    alt={`Product image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                    }}
                    fallback="https://via.placeholder.com/300"
                    onError={(e) => handleImageError(e, url.original)}
                    onClick={() => handlePreview(url.original)}
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </Col>
        <Col md={16} xs={24}>
          <h3 className="text-lg font-semibold text-[#1677ff] mb-2">Details:</h3>
          <div
            className='modal-scroll'
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="ID">{product._id?.slice(-6)}</Descriptions.Item>
              <Descriptions.Item label="Name">{product.name}</Descriptions.Item>
              <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
              <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
              <Descriptions.Item label="Subcategory">{product.subcategory}</Descriptions.Item>
              <Descriptions.Item label="Price">{`Rs.${Number(product.price).toFixed(2)}`}</Descriptions.Item>
              <Descriptions.Item label="Sizes">
                {product.sizes?.length > 0 ? product.sizes.join(', ') : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
              <Descriptions.Item label="Fit Type">{product.fitType}</Descriptions.Item>
              <Descriptions.Item label="Stretch">{product.stretch}</Descriptions.Item>
              <Descriptions.Item label="Transparency">{product.transparency}</Descriptions.Item>
              <Descriptions.Item label="Hand Feel">{product.handFeel}</Descriptions.Item>
              <Descriptions.Item label="Lining">{product.lining}</Descriptions.Item>
              <Descriptions.Item label="Material">{product.material}</Descriptions.Item>
              <Descriptions.Item label="Occasion">{product.occasion}</Descriptions.Item>
              <Descriptions.Item label="Design Details">{product.designDetails}</Descriptions.Item>
              <Descriptions.Item label="Note">{product.note}</Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(product.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
      </Row>
      {previewImage && (
        <Modal
          open={!!previewImage}
          footer={null}
          onCancel={() => setPreviewImage(null)}
          width={800}
        >
          <Image
            src={previewImage}
            alt="Full-size preview"
            style={{ width: '100%', objectFit: 'contain' }}
            preview={true}
            onError={() => console.error(`Failed to load preview: ${previewImage}`)}
          />
        </Modal>
      )}
    </Modal>
  );
};

export default ViewModal;