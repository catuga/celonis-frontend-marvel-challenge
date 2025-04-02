import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { Citizenship } from '../../models/enums';

Chart.register(...registerables);

export const CHART_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#8AC24A'
];

@Component({
  selector: 'app-chart',
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnChanges {
  @Input() data: { label: string, count: number }[] = [];

  private labelColorMap = new Map<string, string>();

  public chartType: ChartType = 'pie';
  public chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            return `${this.getFullLabel(label)}: ${value}`;
          }
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChart();
    }
  }

  private getShortLabel(label: string | undefined | null): string {
    if (!label) return '';
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const entry = Object.entries(Citizenship).find(([_, value]) => value === label);
    return entry ? entry[0] : label;
  }  

  private getFullLabel(label: string | undefined | null): string {
    if (!label) return '';
    
    const entry = Object.entries(Citizenship).find(([key]) => key === label);
    return entry ? entry[1] : label;
  }
  

  private getColorForLabel(label: string): string {
    if (!this.labelColorMap.has(label)) {
      const colorIndex = this.labelColorMap.size % CHART_COLORS.length;
      this.labelColorMap.set(label, CHART_COLORS[colorIndex]);
    }
    return this.labelColorMap.get(label) || CHART_COLORS[0];
  }

  private updateChart(): void {
    this.chartType = this.data.length <= 5 ? 'pie' : 'bar';

    this.chartData = {
      labels: this.data.map(item => this.getShortLabel(item.label)),
      datasets: [{
        data: this.data.map(item => item.count),
        backgroundColor: this.data.map(item => this.getColorForLabel(item.label))
      }]
    };

    if (this.chartType === 'bar') {
      this.chartOptions = {
        ...this.chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#333'
            }
          },
          x: {
            ticks: {
              color: '#333',
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      };
    }
  }
} 