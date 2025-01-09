import { render, screen } from '@app/test-utils';
import { Addresses } from './Address.component';
import { JolokiaAuthentication } from '@app/jolokia/components/JolokiaAuthentication';
import { useJolokiaServiceGetAddresses } from '@app/openapi/jolokia/queries';
import {
  BrokerConnectionData,
  useGetEndpointData,
} from '@app/jolokia/customHooks';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  VirtualizedTable: jest.fn(({ Row, data, columns }) => (
    <div>
      <div>VirtualizedTable</div>
      {data.map((item: any, index: number) => (
        <Row
          key={index}
          obj={item}
          activeColumnIDs={columns.map((col: any) => col.id)}
        />
      ))}
    </div>
  )),
}));

jest.mock('../../openapi/jolokia/queries', () => ({
  useJolokiaServiceGetAddresses: jest.fn(),
}));

jest.mock('../../jolokia/customHooks', () => ({
  useGetEndpointData: jest.fn(),
  useGetApiServerBaseUrl: jest.fn(),
}));

jest.mock('./AddressRow', () => ({
  AddressRow: jest.fn(() => <div>AddressRow Component</div>),
}));

const mockUseJolokiaServiceReadAddressAttributes =
  useJolokiaServiceGetAddresses as jest.Mock;
const mockUseGetEndpointData = useGetEndpointData as jest.Mock;

describe('Addresses', () => {
  const mockData = [
    { request: { Name: 'activemq.notification' }, RoutingType: 'MULTICAST' },
    { request: { Name: 'DLQ' }, RoutingType: 'ANYCAST' },
    { request: { Name: 'ExpiryQueue' }, RoutingType: 'ANYCAST' },
    { request: { Name: 'sys.mqtt.sessions' }, RoutingType: 'ANYCAST' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseJolokiaServiceReadAddressAttributes.mockReturnValue({
      data: mockData,
      isLoading: true,
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

  it('should render the Addresses title when isBrokerPod is true', () => {
    mockUseJolokiaServiceReadAddressAttributes.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      isSuccess: true,
      error: null,
    });
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <Addresses isBrokerPod={true} />
      </JolokiaAuthentication>,
    );
    expect(screen.getByText('Addresses')).toBeInTheDocument();
  });

  it('should show the "This is not a Broker Pod" message when isBrokerPod is false', () => {
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <Addresses isBrokerPod={false} />
      </JolokiaAuthentication>,
    );
    expect(screen.getByText('This is not a Broker Pod')).toBeInTheDocument();
  });

  it('should display the loading state when data is being fetched', () => {
    mockUseJolokiaServiceReadAddressAttributes.mockReturnValueOnce({
      data: mockData,
      isLoading: true,
      isSuccess: true,
      error: null,
    });
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <Addresses isBrokerPod={true} />
      </JolokiaAuthentication>,
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should display an error message if there is a load error', () => {
    mockUseJolokiaServiceReadAddressAttributes.mockReturnValueOnce({
      data: null,
      isLoading: true,
      isSuccess: false,
      error: true,
    });
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <Addresses isBrokerPod={true} />
      </JolokiaAuthentication>,
    );
    expect(
      screen.getByText('Error while fetching addresses'),
    ).toBeInTheDocument();
  });

  it('should render the AddressRow component within the VirtualizedTable when data is available', () => {
    mockUseJolokiaServiceReadAddressAttributes.mockReturnValueOnce({
      data: mockData,
      isLoading: false,
      isSuccess: true,
      error: null,
    });
    render(
      <JolokiaAuthentication brokerCR={{ spec: {} }} podOrdinal={0}>
        <Addresses isBrokerPod={true} />
      </JolokiaAuthentication>,
    );
    expect(screen.getAllByText('AddressRow Component')[0]).toBeInTheDocument();
  });
});
