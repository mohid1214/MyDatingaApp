import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../Core/services/member-service';
import { Member, MemberPrams } from '../../../types/member';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../Shared/paginator/paginator";
import { FilterModal } from '../filter-modal/filter-modal';
import { filter } from 'rxjs';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal!: FilterModal;
  protected memberService = inject(MemberService);
  protected paginatedMembers = signal<PaginatedResult<Member> | null>(null);
  protected memberParams = new MemberPrams();
  private updatedParams = new MemberPrams();

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      this.memberParams = JSON.parse(filters);
      this.updatedParams = JSON.parse(filters);
    }
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.memberParams).subscribe({
      next: result => {
        this.paginatedMembers.set(result);
      }
    })
  }

  onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageSize = event.pageSize;
    this.memberParams.pageNumber = event.pageNumber
    this.loadMembers()
  }

  openModal() {
    this.modal.open();
  }

  onClose() {
    console.log("Modal Closed");
  }

  onFilterChange(data: MemberPrams) {
    this.memberParams = { ...data };
    this.updatedParams = { ...data };
    this.loadMembers();
  }

  resetFilters() {
    this.memberParams = new MemberPrams();
    this.updatedParams = new MemberPrams();
    this.loadMembers();
  }

  get displayMessage(): string {
    const defaultParams = new MemberPrams();

    const filters: string[] = [];
    if (this.updatedParams.gender) {
      filters.push(this.updatedParams.gender + 's')
    } else {
      filters.push('Males', 'Females');
    }

    if (this.updatedParams.minAge != defaultParams.minAge || this.updatedParams.maxAge != defaultParams.maxAge) {
      filters.push(` ages ${this.updatedParams.minAge}-${this.updatedParams.maxAge}`);
    }

    filters.push(this.updatedParams.orderBy == 'lastActive' ? 'Recently Active' : 'Newest Members');

    return filter.length > 0 ? `selected: ${filters.join('  | ')}` : 'All Members'

  }
}
