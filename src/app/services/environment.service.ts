import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Environment } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  evironment = new BehaviorSubject<Environment>(null)

  constructor() { }
}
