import React from 'react';
import { render } from '@testing-library/react-native';
import MapContainer from '../MapContainer';

describe('MapContainer', () => {

  const mockImageSource = { uri: 'http://example.com/map.png' };
  
  it('passa a fonte de imagem corretamente para o componente Image', () => {
    const { UNSAFE_getByType } = render(
      <MapContainer source={mockImageSource} />
    );

    const imageComponent = UNSAFE_getByType('Image');
    
    
    expect(imageComponent.props.source).toEqual(mockImageSource);
  });
  
  it('configura resizeMode como "cover" para o componente Image', () => {
    const { UNSAFE_getByType } = render(
      <MapContainer source={mockImageSource} />
    );
    

    const imageComponent = UNSAFE_getByType('Image');
    

    expect(imageComponent.props.resizeMode).toBe('cover');
  });
  
  it('renderiza com uma fonte de imagem diferente', () => {
    const anotherImageSource = { uri: 'http://example.com/another-map.png' };
    
    const { UNSAFE_getByType } = render(
      <MapContainer source={anotherImageSource} />
    );
    
    const imageComponent = UNSAFE_getByType('Image');
    
    expect(imageComponent.props.source).toEqual(anotherImageSource);
  });
  
  it('renderiza com fonte de imagem local (require)', () => {
    const localImageSource = 1; 
    
    const { UNSAFE_getByType } = render(
      <MapContainer source={localImageSource} />
    );
    
    const imageComponent = UNSAFE_getByType('Image');
    
    expect(imageComponent.props.source).toBe(localImageSource);
  });
});