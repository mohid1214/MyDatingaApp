import { Component, inject } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  imports: [AsyncPipe],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {
  protected memberService = inject(MemberService);
  protected members$: Observable<Member[]>;

  constructor(){
    this.members$ = this.memberService.getMembers();
  }

}
