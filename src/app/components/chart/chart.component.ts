import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { Citizenship } from '../../models/enums';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

Chart.register(...registerables);

export const CHART_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#8AC24A',
];

@Component({
  selector: 'app-chart',
  imports: [BaseChartDirective, AsyncPipe],
  templateUrl: './chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnChanges {
  @Input() data: { label: string; count: number }[] = [];

  private labelColorMap = new Map<string, string>();
  private dataSubject = new BehaviorSubject<{ label: string; count: number }[]>(
    []
  );

  public chartType: ChartType = 'pie';
  public chartData$: Observable<ChartConfiguration['data']>;
  public chartOptions$: Observable<ChartConfiguration['options']>;

  constructor() {
    this.chartData$ = this.dataSubject.pipe(
      map((data) => this.createChartData(data))
    );

    this.chartOptions$ = this.dataSubject.pipe(
      map((data) => this.createChartOptions(data))
    );
  }

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            return `${this.getFullLabel(label)}: ${value}`;
          },
        },
      },
    },
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      const currentData = changes['data'].currentValue;
      const previousData = changes['data'].previousValue;

      if (this.hasDataChange(currentData, previousData)) {
        this.dataSubject.next(this.data);
      }
    }
  }

  hasDataChange(currentData: any[], previousData: any[]): boolean {
    if (!previousData || currentData.length !== previousData.length) {
      return true;
    }

    for (let i = 0; i < currentData.length; i++) {
      const current = currentData[i];
      const previous = previousData[i];

      if (
        current.label !== previous.label ||
        current.count !== previous.count
      ) {
        return true;
      }
    }

    return false;
  }

  private getShortLabel(label: string | undefined | null): string {
    if (!label) return '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const entry = Object.entries(Citizenship).find(
      ([_, value]) => value === label
    );
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

  private createChartData(
    data: { label: string; count: number }[]
  ): ChartConfiguration['data'] {
    return {
      labels: data.map((item) => this.getShortLabel(item.label)),
      datasets: [
        {
          data: data.map((item) => item.count),
          backgroundColor: data.map((item) =>
            this.getColorForLabel(item.label)
          ),
        },
      ],
    };
  }

  private createChartOptions(
    data: { label: string; count: number }[]
  ): ChartConfiguration['options'] {
    const chartType = data.length <= 5 ? 'pie' : 'bar';
    this.chartType = chartType;

    if (chartType === 'bar') {
      return {
        ...this.chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#333',
            },
          },
          x: {
            ticks: {
              color: '#333',
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
      };
    }

    return this.chartOptions;
  }
}
