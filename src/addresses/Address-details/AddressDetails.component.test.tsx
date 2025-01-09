import { fireEvent, render, screen } from '@app/test-utils';
import { AddressDetails } from './AddressDetails.component';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';
import { useJolokiaServiceReadAddressAttributes } from '@app/openapi/jolokia/queries';
import {
  BrokerConnectionData,
  useGetEndpointData,
} from '@app/jolokia/customHooks';

jest.mock('../../openapi/jolokia/queries', () => ({
  useJolokiaServiceReadAddressAttributes: jest.fn(),
}));

jest.mock('../../jolokia/customHooks', () => ({
  useGetEndpointData: jest.fn(),
  useGetApiServerBaseUrl: jest.fn(),
}));

const mockUseJolokiaServiceReadAddressAttributes =
  useJolokiaServiceReadAddressAttributes as jest.Mock;
const mockUseGetEndpointData = useGetEndpointData as jest.Mock;

describe('AddressDetails', () => {
  const mockData = [
    { request: { attribute: 'Address' }, value: 'DLQ' },
    { request: { attribute: 'AddressSize' }, value: 0 },
    { request: { attribute: 'AutoCreated' }, value: false },
    { request: { attribute: 'MessageCount' }, value: 0 },
    { request: { attribute: 'RoutingTypes' }, value: 'Anycast' },
    { request: { attribute: 'BindingNames' }, value: 'DLQ' },
    { request: { attribute: 'CurrentDuplicateIdCacheSize' }, value: 0 },
    { request: { attribute: 'Internal' }, value: false },
    { request: { attribute: 'AddressLimitPercent' }, value: 0 },
    { request: { attribute: 'NumberOfBytesPerPage' }, value: 1245 },
    { request: { attribute: 'NumberOfMessages' }, value: 0 },
    { request: { attribute: 'QueueNames' }, value: 'DLQ' },
  ];

  beforeEach(() => {
    mockUseJolokiaServiceReadAddressAttributes.mockReturnValue({
      data: mockData,
      isSuccess: true,
      error: null,
    });
    const bcd: BrokerConnectionData = {
      brokerName: 'amqBroker',
      hostname: 'some.name.org',
      port: '80',
      scheme: 'https',
      targetEndpoint: 'https://some.name.org:80',
    };
    mockUseGetEndpointData.mockReturnValue(bcd);
  });

  it('should renders data correctly when fetch is successful', () => {
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressDetails name="DLQ" />
      </JolokiaAuthentication>,
    );
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('AddressSize')).toBeInTheDocument();
    expect(screen.getByText('AutoCreated')).toBeInTheDocument();
    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.getByText('RoutingTypes')).toBeInTheDocument();
  });

  it('should renders loading spinner initially when data not available', () => {
    (useJolokiaServiceReadAddressAttributes as jest.Mock).mockReturnValueOnce({
      data: null,
      isSuccess: false,
      error: null,
    });
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressDetails name="DLQ" />
      </JolokiaAuthentication>,
    );
    expect(screen.getByText('Attributes')).toBeInTheDocument();
  });

  it('should filters the data based on search input', () => {
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressDetails name="DLQ" />
      </JolokiaAuthentication>,
    );

    const searchInput = screen.getByPlaceholderText(
      'Search by attribute name...',
    );
    fireEvent.change(searchInput, { target: { value: 'Message' } });

    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.queryByText('Address')).not.toBeInTheDocument();
  });

  it('should clear the search input and reset the initial data when search input is cleared', () => {
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressDetails name="DLQ" />
      </JolokiaAuthentication>,
    );
    //initial data rendered
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('AddressSize')).toBeInTheDocument();
    expect(screen.getByText('AutoCreated')).toBeInTheDocument();
    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.getByText('RoutingTypes')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      'Search by attribute name...',
    );
    fireEvent.change(searchInput, { target: { value: 'Message' } });

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput).toBeInTheDocument();
    //Verify that the initial data is displayed again
    expect(screen.getByText('Address')).toBeInTheDocument();
    expect(screen.getByText('AddressSize')).toBeInTheDocument();
    expect(screen.getByText('AutoCreated')).toBeInTheDocument();
    expect(screen.getByText('MessageCount')).toBeInTheDocument();
    expect(screen.getByText('RoutingTypes')).toBeInTheDocument();
  });

  it('should update the current page when pagination controls are used', () => {
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressDetails name="DLQ" />
      </JolokiaAuthentication>,
    );
    const initialTextInput = screen.getAllByDisplayValue(/1/i)[0];
    expect(initialTextInput).toHaveValue(1);
    fireEvent.click(
      screen.getAllByRole('button', { name: /go to next page/i })[0],
    );
    const updateTextInput = screen.getAllByDisplayValue(/2/i)[0];
    expect(updateTextInput).toHaveValue(2);
  });

  it('should display the error message when data is not available and failure', () => {
    (useJolokiaServiceReadAddressAttributes as jest.Mock).mockReturnValueOnce({
      data: null,
      isSuccess: false,
      error: true,
    });
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <AddressDetails name="DLQ" />
      </JolokiaAuthentication>,
    );
    expect(
      screen.getByText('Error loading address details...'),
    ).toBeInTheDocument();
  });
});
