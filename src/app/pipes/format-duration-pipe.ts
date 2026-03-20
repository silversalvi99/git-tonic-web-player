import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDuration',
  standalone: true,
})
export class FormatDurationPipe implements PipeTransform {
  transform(seconds: string | number | undefined): string {
    if (!seconds) {
      return '0:00';
    }

    const secondsNumber = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
    const mins = Math.floor(secondsNumber / 60);
    const secs = Math.floor(secondsNumber % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
