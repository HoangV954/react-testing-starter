import { render, screen } from '@testing-library/react'
import Label from '../../src/components/Label'
import { LanguageProvider } from '../../src/providers/language/LanguageProvider'
import { Language } from '../../src/providers/language/type'

describe('Label', () => {

  const renderLabel = (labelId: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={labelId} />
      </LanguageProvider>
    )
  }
  describe('Given the current language is EN', () => {
    it.each([
      {
        labelId: 'welcome',
        text: 'Welcome'
      },
      {
        labelId: 'new_product',
        text: 'New Product'
      },
      {
        labelId: 'edit_product',
        text: 'Edit Product'
      }
    ])('should render $text for $labelId', ({ labelId, text }) => {
      renderLabel(labelId, 'en');

      expect(screen.getByText(text)).toBeInTheDocument();
    })
  })

  describe('Given the current language is ES', () => {
    it.each([
      {
        labelId: 'welcome',
        text: 'Bienvenidos'
      },
      {
        labelId: 'new_product',
        text: 'Nuevo Producto'
      },
      {
        labelId: 'edit_product',
        text: 'Editar Producto'
      }
    ])('should render $text for $labelId', ({ labelId, text }) => {
      renderLabel(labelId, 'es');

      expect(screen.getByText(text)).toBeInTheDocument();
    })
  })

  it('should throw error if labelId is not invalid', () => {
    expect(() => renderLabel('!@#$%', 'en')).toThrowError();
    // Has to use arrow cuz if we call renderLabel before the expect it will always be an error

  })
})