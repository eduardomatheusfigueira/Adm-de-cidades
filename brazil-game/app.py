import dash
from dash import html, dcc
import dash_bootstrap_components as dbc
import dash_leaflet as dl

# Mapbox Token
MAPBOX_TOKEN = "pk.eyJ1IjoiZWR1YXJkb21hdGhldXNmaWd1ZWlyYSIsImEiOiJjbTgwd2tqbzYwemRrMmpwdGVka2FrMG5nIn0.NfOWy2a0J-YHP4mdKs_TAQ"

# Base Layer for Mapbox
basemap = dl.TileLayer(
    url=f"https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{{z}}/{{x}}/{{y}}?access_token={{token}}",
    attribution="Mapbox",
    maxZoom=18,
    tileSize=512,
    zoomOffset=-1,
    token=MAPBOX_TOKEN
)

# Initialize Dash app
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
server = app.server

# App layout
app.layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H1("Jogo de Administração e Eleições do Brasil",
                    className="text-center my-4"),
            html.P("Versão em desenvolvimento - Mapa com Mapbox integrado",
                   className="text-center"),
            html.Hr(),
            html.Div([
                html.H3("Mapa do Brasil"),
                html.P("Mapa interativo do Brasil usando Mapbox e Dash Leaflet."),
                dcc.Loading(
                    id="loading-map",
                    type="default",
                    children=[
                        dl.Map([basemap],
                                id="map",
                                zoom=4,
                                center=[-15, -50],  # Center on Brazil
                                style={'width': '100%', 'height': '500px'})
                    ]
                )
            ]),
            html.Div([
                html.H3("Próximos Passos"),
                html.P("Consulte o arquivo roadmap.txt para o plano de desenvolvimento."),
                html.Ul([
                    html.Li("Baixar GeoJSON do IBGE para a pasta data/"),
                    html.Li("Carregar e exibir GeoJSON do mapa do Brasil"),
                    html.Li("Integrar dados CSV e interatividade")
                ])
            ], className="mt-4")
        ], width=12)
    ])
], fluid=True)

if __name__ == '__main__':
    app.run_server(debug=True)
