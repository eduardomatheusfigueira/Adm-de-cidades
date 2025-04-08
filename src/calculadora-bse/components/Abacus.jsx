import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const Abacus = ({ pedraPositions: initialPositions }) => {
  const [molas, setMolas] = useState({
    'Saúde': { 'Saneamento': 0.8, 'Educação': 0.3 },
    'Saneamento': { 'Educação': 0.5 },
    'Educação': {}
  });
  const [pedraPositions, setPedraPositions] = useState(initialPositions || {
    'Saúde': 300,
    'Saneamento': 400,
    'Educação': 200
  });
  const [isDragging, setIsDragging] = useState(false);
  const [activePedra, setActivePedra] = useState(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (initialPositions) {
      setPedraPositions(initialPositions);
    }
  }, [initialPositions]);

  const handleMolaChange = (ind1, ind2, value) => {
    const newMolas = { ...molas };
    if (newMolas[ind1] && newMolas[ind1][ind2] !== undefined) {
      newMolas[ind1][ind2] = parseFloat(value);
    } else if (newMolas[ind2] && newMolas[ind2][ind1] !== undefined) {
      // Corrected logic: Update the connection from ind2 to ind1 if it exists
      newMolas[ind2][ind1] = parseFloat(value);
    }
    setMolas(newMolas);
  };


  const handleMouseDown = (event, indicador) => {
    setIsDragging(true);
    setActivePedra(indicador);
    // Ensure we get the correct SVG element's coordinate system
    const svgPoint = event.target.ownerSVGElement.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const svgCoord = svgPoint.matrixTransform(event.target.getScreenCTM().inverse());
    setOffsetY(svgCoord.y - pedraPositions[indicador]);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    // Get coordinates relative to the SVG container
    const svgPoint = event.target.ownerSVGElement.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const svgCoord = svgPoint.matrixTransform(event.target.getScreenCTM().inverse());

    let y = svgCoord.y - offsetY;
    if (y < 100) y = 100; // Upper bound
    if (y > 500) y = 500; // Lower bound

    const deltaY = y - pedraPositions[activePedra]; // Calculate the difference in position

    const newPositions = { ...pedraPositions };
    newPositions[activePedra] = y; // Update the active stone

    // Apply the "spring" effect to connected stones
    for (const connectedPedra in molas[activePedra]) {
      const molaEffect = molas[activePedra][connectedPedra];
      let connectedPedraNewY = pedraPositions[connectedPedra] + deltaY * molaEffect;

      // Ensure the new position is within bounds
      if (connectedPedraNewY < 100) connectedPedraNewY = 100;
      if (connectedPedraNewY > 500) connectedPedraNewY = 500;
      newPositions[connectedPedra] = connectedPedraNewY;
    }

    // For bidirectional springs (if 'Saneamento' also influences 'Saúde', for example)
    for (const indicador in molas) {
      if (molas[indicador].hasOwnProperty(activePedra) && indicador !== activePedra) {
        const molaEffect = molas[indicador][activePedra];
        let connectedPedraNewY = pedraPositions[indicador] + deltaY * molaEffect;
         if (connectedPedraNewY < 100) connectedPedraNewY = 100;
        if (connectedPedraNewY > 500) connectedPedraNewY = 500;
        newPositions[indicador] = connectedPedraNewY;
      }
    }


    setPedraPositions(newPositions);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActivePedra(null);
  };

  const calculateValue = (position) => {
    // Normalize the value between 0 and 1 based on the position (100=1, 500=0)
    return ((500 - position) / 400).toFixed(2);
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 justify-content-center">
        <Col xs={12} className="text-center">
          <h1>Ábaco de Indicadores Interativo</h1>
        </Col>
      </Row>
      <Row>
        {/* Abacus Visualization Column */}
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Ábaco</Card.Title>
              <Card.Text>
                Arraste as pedras para interagir com o ábaco. Os valores abaixo refletem as posições.
              </Card.Text>
              <div style={{ height: '600px', border: '1px solid #ccc', position: 'relative', overflow: 'hidden' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}> {/* Handle leaving the SVG area */}
                <svg width="100%" height="100%" viewBox="0 0 800 600"> {/* Added viewBox for responsiveness */}
                  {/* Rods */}
                  <line x1="150" y1="100" x2="150" y2="500" stroke="#8B4513" strokeWidth="6" />
                  <line x1="148" y1="100" x2="148" y2="500" stroke="#D2B48C" strokeWidth="2" />
                  <line x1="152" y1="100" x2="152" y2="500" stroke="#D2B48C" strokeWidth="2" />

                  <line x1="400" y1="100" x2="400" y2="500" stroke="#8B4513" strokeWidth="6" />
                  <line x1="398" y1="100" x2="398" y2="500" stroke="#D2B48C" strokeWidth="2" />
                  <line x1="402" y1="100" x2="402" y2="500" stroke="#D2B48C" strokeWidth="2" />

                  <line x1="650" y1="100" x2="650" y2="500" stroke="#8B4513" strokeWidth="6" />
                  <line x1="648" y1="100" x2="648" y2="500" stroke="#D2B48C" strokeWidth="2" />
                  <line x1="652" y1="100" x2="652" y2="500" stroke="#D2B48C" strokeWidth="2" />

                  {/* Springs (Lines connecting stones) */}
                  <line x1="150" y1={pedraPositions['Saúde']} x2="400" y2={pedraPositions['Saneamento']} stroke="#FF4500" strokeWidth={molas['Saúde']['Saneamento'] * 5 + 1} strokeDasharray="4 2" />
                  <line x1="150" y1={pedraPositions['Saúde']} x2="650" y2={pedraPositions['Educação']} stroke="#FF4500" strokeWidth={molas['Saúde']['Educação'] * 5 + 1} strokeDasharray="4 2" />
                  <line x1="400" y1={pedraPositions['Saneamento']} x2="650" y2={pedraPositions['Educação']} stroke="#FF4500" strokeWidth={molas['Saneamento']['Educação'] * 5 + 1} strokeDasharray="4 2" />

                  {/* Stones (Circles) */}
                  <circle cx="150" cy={pedraPositions['Saúde']} r="25" fill="#1E90FF" stroke="#104E8B" strokeWidth="3" style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                    onMouseDown={(e) => handleMouseDown(e, 'Saúde')}
                  />
                  <circle cx="400" cy={pedraPositions['Saneamento']} r="25" fill="#1E90FF" stroke="#104E8B" strokeWidth="3" style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                    onMouseDown={(e) => handleMouseDown(e, 'Saneamento')}
                  />
                  <circle cx="650" cy={pedraPositions['Educação']} r="25" fill="#1E90FF" stroke="#104E8B" strokeWidth="3" style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                    onMouseDown={(e) => handleMouseDown(e, 'Educação')}
                  />

                   {/* Labels */}
                   <text x="150" y="80" textAnchor="middle" style={{fontSize: '14px', fontWeight: 'bold', fill: '#333'}}>Saúde</text>
                   <text x="400" y="80" textAnchor="middle" style={{fontSize: '14px', fontWeight: 'bold', fill: '#333'}}>Saneamento</text>
                   <text x="650" y="80" textAnchor="middle" style={{fontSize: '14px', fontWeight: 'bold', fill: '#333'}}>Educação</text>

                   {/* Values */}
                   <text x="150" y="520" textAnchor="middle" style={{fontSize: '12px', fill: '#333'}}>Valor: {calculateValue(pedraPositions['Saúde'])}</text>
                   <text x="400" y="520" textAnchor="middle" style={{fontSize: '12px', fill: '#333'}}>Valor: {calculateValue(pedraPositions['Saneamento'])}</text>
                   <text x="650" y="520" textAnchor="middle" style={{fontSize: '12px', fill: '#333'}}>Valor: {calculateValue(pedraPositions['Educação'])}</text>
                </svg>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* Controls Column */}
        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title>Controles do Ábaco</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Editar Molas (Influência)</Form.Label>
                  <div className="mb-2">
                    <Form.Label htmlFor="molaSaudeSaneamento" style={{fontSize: '0.9rem'}}>Saúde - Saneamento:</Form.Label>
                    <Form.Control id="molaSaudeSaneamento" type="number" step="0.1" min="0" max="1" size="sm" value={molas['Saúde']['Saneamento']} onChange={(e) => handleMolaChange('Saúde', 'Saneamento', e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <Form.Label htmlFor="molaSaudeEducacao" style={{fontSize: '0.9rem'}}>Saúde - Educação:</Form.Label>
                    <Form.Control id="molaSaudeEducacao" type="number" step="0.1" min="0" max="1" size="sm" value={molas['Saúde']['Educação']} onChange={(e) => handleMolaChange('Saúde', 'Educação', e.target.value)} />
                  </div>
                  <div className="mb-2">
                    <Form.Label htmlFor="molaSaneamentoEducacao" style={{fontSize: '0.9rem'}}>Saneamento - Educação:</Form.Label>
                    <Form.Control id="molaSaneamentoEducacao" type="number" step="0.1" min="0" max="1" size="sm" value={molas['Saneamento']['Educação']} onChange={(e) => handleMolaChange('Saneamento', 'Educação', e.target.value)} />
                  </div>
                </Form.Group>
                {/* Placeholder for adding new rods - functionality not implemented */}
                {/* <Form.Group className="mb-3">
                  <Form.Label>Adicionar Nova Haste</Form.Label>
                  <Form.Control type="text" placeholder="Nome da Haste" />
                  <Button variant="primary" className="mt-2" disabled>Adicionar Haste</Button>
                </Form.Group> */}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Abacus;
