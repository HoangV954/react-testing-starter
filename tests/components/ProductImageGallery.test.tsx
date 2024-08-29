import { render, screen } from '@testing-library/react'
import ProductImageGallery from '../../src/components/ProductImageGallery'


describe('ProductImageGallery', () => {
  it('should render nothing when image array is empty', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
  })

  it('should render a list of images', () => {
    const imageUrls = [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ]

    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole('img');

    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute('src', url);
    })
  })
})

