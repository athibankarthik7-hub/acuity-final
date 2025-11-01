# ACUITY - Adaptive Pricing & Inventory Intelligence

AI-powered dynamic pricing and inventory optimization platform that minimizes waste and maximizes revenue through demand forecasting, linear programming optimization, Monte Carlo simulation, and game theory competitor modeling.

## Features

- **Dynamic Pricing Engine**: ML-powered price recommendations using demand elasticity models
- **Inventory Optimization**: Batch-level tracking with expiry awareness and depreciation modeling
- **Demand Forecasting**: Time-series regression with Markov-inspired transitions
- **LP Optimization**: Linear programming formulation to maximize profit subject to constraints
- **Monte Carlo Simulation**: Uncertainty quantification for profit distributions
- **Competitor Modeling**: Game theory based price response strategies
- **Real-time Dashboard**: Live KPIs, heatmaps, and optimization controls
- **Analytics Suite**: Seasonality detection, sensitivity analysis, scenario planning

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Recharts
- **Backend**: Next.js API Routes
- **Design**: Teal/Graphite/Yellow color scheme with shadcn/ui components

## Project Structure

\`\`\`
ACUITY/
├── app/
│   ├── dashboard/        # Main optimization dashboard
│   ├── products/         # Inventory management
│   ├── analytics/        # Demand & market analysis
│   ├── simulator/        # Monte Carlo & competitor sim
│   ├── api/              # Backend endpoints
│   │   ├── products/     # Product CRUD
│   │   ├── recommendations/  # Core pricing engine
│   │   ├── analytics/    # Analytics data
│   │   ├── run_simulation/   # Monte Carlo
│   │   └── competitor_simulate/  # Game theory
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home redirect
├── components/
│   ├── header.tsx        # Navigation
│   ├── kpi-metrics.tsx   # KPI cards
│   ├── product-heatmap.tsx   # Stock/expiry visualization
│   ├── product-list.tsx  # Inventory table
│   ├── add-product-form.tsx  # Product creation
│   └── competitor-simulator.tsx  # Competitor UI
├── styles/
│   └── globals.css       # Tailwind + ACUITY theme
└── README.md
\`\`\`

## Algorithms

### Demand Forecasting
Simplified Markov-inspired model predicting demand as:
\`\`\`
predicted_demand = base_demand * demand_index * seasonal_factor * day_factor
\`\`\`

### Linear Programming (LP)
\`\`\`
maximize: Σ(price_i * expected_sales_i - holding_cost_i * leftover_i - waste_i)

subject to:
  - stock_i ≥ 0
  - min_price_i ≤ price_i ≤ max_price_i
  - margin_i ≥ 15%
  - warehouse_capacity constraint
\`\`\`

### Depreciation Model
- **Perishables**: Exponential decay toward scrap value
- **Electronics**: Linear depreciation based on age
- **Others**: Minimal decay

### Monte Carlo Simulation
Runs N iterations sampling:
- Demand volatility (normal distribution, CV=20%)
- Competitor pricing moves
- Supply disruptions (5% probability)

Outputs profit distribution and percentile analysis.

### Game Theory (Nash Equilibrium)
Simplified logit model for market share:
\`\`\`
share_i = exp(λ * price_i) / Σ_j(exp(λ * price_j))
\`\`\`
Computes best-response prices under competitive scenarios.

## Getting Started

### Installation

1. Clone and install:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000)

### Adding Sample Data

Sample products are auto-generated on first load. Navigate to `/products` to add custom inventory.

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET/POST | List/add products |
| `/api/recommendations` | GET | Get pricing recommendations |
| `/api/analytics` | GET | Demand forecasts & analysis |
| `/api/run_simulation` | POST | Execute Monte Carlo (1000 samples default) |
| `/api/competitor_simulate` | POST | Analyze competitor scenarios |

### Customizing Business Rules

Edit these constants in `app/api/recommendations/route.ts`:
\`\`\`typescript
- elasticity: -1.5 (price sensitivity)
- min_margin: 15%
- max_markdown: 40%
- holding_cost_factor: custom per product
\`\`\`

## Configuration

### Environment Variables (Optional)
\`\`\`
NEXT_PUBLIC_OPTIMIZATION_SAMPLES=1000
NEXT_PUBLIC_FORECAST_HORIZON=28
\`\`\`

## Future Enhancements

- [ ] Persist data to database (Supabase/Neon)
- [ ] User authentication and multi-tenant support
- [ ] Real ML models (scikit-learn, TensorFlow.js)
- [ ] WebSocket for real-time simulations
- [ ] PDF report generation
- [ ] Advanced competitor API integrations
- [ ] Supply chain forecasting

## Dashboard Screenshots

### Overview
- Real-time KPIs: Projected Revenue, Waste Reduction, Avg Margin, Risk Metric
- Product heatmap with stock & expiry status
- Price recommendations with expected sales impact

### Analytics
- 12-week demand forecast with confidence intervals
- Seasonality indices by product category
- Price sensitivity analysis (elasticity curves)

### Simulator
- Monte Carlo profit distribution (histogram)
- Market share impact under different competitor strategies
- Nash equilibrium analysis

## Performance Notes

- In-memory data storage for demo (production should use SQL database)
- LP solver is simplified (full version would use PuLP or CPLEX)
- Monte Carlo uses 1000 samples by default (configurable)
- Frontend renders up to 50 products before virtualization needed

## Support

For detailed algorithm documentation, see:
- `app/api/recommendations/route.ts` - LP formulation & demand elasticity
- `app/api/run_simulation/route.ts` - Monte Carlo sampling strategy
- `app/api/competitor_simulate/route.ts` - Game theory & Nash equilibrium

## License

MIT
