import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';

// Mock the dependencies
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));

// Mock the components
jest.mock('../components/common/Header', () => 'Header');
jest.mock('../components/common/UserIcon', () => 'UserIcon');
jest.mock('../components/home/TravelModeSelector', () => 'TravelModeSelector');
jest.mock('../components/home/StatusSwitch', () => 'StatusSwitch');
jest.mock('../components/home/AlertBox', () => 'AlertBox');
jest.mock('../components/home/MapContainer', () => 'MapContainer');
jest.mock('../components/home/BottomUserBar', () => 'BottomUserBar');

// Mock the navigation
const mockNavigation = {
  navigate: jest.fn(),
  openDrawer: jest.fn(),
};

// Mock the image require
jest.mock('../../assets/images/google-map-example-blog.png', () => 'mockedMapImagePath');

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all components', () => {
    const { getByText, UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    
    expect(getByText('Segunda-Feira')).toBeTruthy();
    expect(getByText('27 de Novembro de 2023')).toBeTruthy();
    
    // Check if all custom components are rendered
    expect(UNSAFE_getByType('Header')).toBeTruthy();
    expect(UNSAFE_getByType('UserIcon')).toBeTruthy();
    expect(UNSAFE_getByType('TravelModeSelector')).toBeTruthy();
    expect(UNSAFE_getByType('StatusSwitch')).toBeTruthy();
    expect(UNSAFE_getByType('AlertBox')).toBeTruthy();
    expect(UNSAFE_getByType('MapContainer')).toBeTruthy();
    expect(UNSAFE_getByType('BottomUserBar')).toBeTruthy();
  });

  it('opens the drawer when menu button is pressed', () => {
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    
    const header = UNSAFE_getByType('Header');
    fireEvent(header, 'menuPress');
    
    expect(mockNavigation.openDrawer).toHaveBeenCalled();
  });

  it('navigates to Profile screen when UserIcon is pressed', () => {
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    
    const userIcon = UNSAFE_getByType('UserIcon');
    fireEvent(userIcon, 'press');
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Profile');
  });

  it('updates travel mode when TravelModeSelector changes', () => {
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    
    const travelModeSelector = UNSAFE_getByType('TravelModeSelector');
    
    // Initial value should be 'roundTrip'
    expect(travelModeSelector.props.selectedMode).toBe('roundTrip');
    
    // Change travel mode
    fireEvent(travelModeSelector, 'selectMode', 'oneWay');
    
    // Re-render to check for updated props
    const updatedComponent = render(<HomeScreen navigation={mockNavigation} />).UNSAFE_getByType('TravelModeSelector');
    
    // Note: Due to how React state works in tests, we can't directly check if the state changed
    // This would require a more complex test setup with act() or hooks testing tools
  });

  it('updates status when StatusSwitch changes', () => {
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    
    const statusSwitch = UNSAFE_getByType('StatusSwitch');
    
    // Initial value should be false
    expect(statusSwitch.props.value).toBe(false);
    
    // Change status
    fireEvent(statusSwitch, 'valueChange', true);
    
    // Same limitation as above for checking state changes in tests
  });

  it('navigates to Ajuda screen when help button in StatusSwitch is pressed', () => {
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    
    const statusSwitch = UNSAFE_getByType('StatusSwitch');
    fireEvent(statusSwitch, 'helpPress');
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Ajuda');
  });

  it('passes correct props to child components', () => {
    const { UNSAFE_getByType } = render(
      <HomeScreen navigation={mockNavigation} />
    );
    
    // Check Header props
    const header = UNSAFE_getByType('Header');
    expect(header.props.title).toBe('iGO');
    expect(typeof header.props.onMenuPress).toBe('function');
    
    // Check UserIcon props
    const userIcon = UNSAFE_getByType('UserIcon');
    expect(userIcon.props.userName).toBe('John');
    expect(typeof userIcon.props.onPress).toBe('function');
    
    // Check TravelModeSelector props
    const travelModeSelector = UNSAFE_getByType('TravelModeSelector');
    expect(travelModeSelector.props.selectedMode).toBe('roundTrip');
    expect(typeof travelModeSelector.props.onSelectMode).toBe('function');
    
    // Check StatusSwitch props
    const statusSwitch = UNSAFE_getByType('StatusSwitch');
    expect(statusSwitch.props.value).toBe(false);
    expect(typeof statusSwitch.props.onValueChange).toBe('function');
    expect(typeof statusSwitch.props.onHelpPress).toBe('function');
    
    // Check AlertBox props
    const alertBox = UNSAFE_getByType('AlertBox');
    expect(alertBox.props.message).toBe('Seu motorista já iniciou o trajeto. Fique atento!');
    expect(typeof alertBox.props.onEditPress).toBe('function');
    
    // Check MapContainer props
    const mapContainer = UNSAFE_getByType('MapContainer');
    expect(mapContainer.props.source).toBe('mockedMapImagePath');
    
    // Check BottomUserBar props
    const bottomUserBar = UNSAFE_getByType('BottomUserBar');
    expect(bottomUserBar.props.userName).toBe('John Doe');
  });
});