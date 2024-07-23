import LeafletMap from '../components/LeafletMap';

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interactive Map with Drawing Tools and Geocoding</h1>
      <p className="mb-4">Use the drawing tools on the left side of the map to add markers, lines, and shapes. You can also search for places using the search bar above the map.</p>
      <LeafletMap />
    </div>
  );
};

export default Index;