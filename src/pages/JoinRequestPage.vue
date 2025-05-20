<template>
  <div class="container mt-4">
    <!-- Card chứa bảng -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Danh sách yêu cầu tham gia</h5>
      </div>
      <div class="card mb-3">
        <div class="card-body">
          <div class="row g-3">
            <!-- Bộ lọc theo trạng thái -->
            <div class="col-md-4">
              <label class="form-label">Trạng thái</label>
              <select
                v-model="filters.status"
                class="form-select"
                @change="fetchRequests"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Đang chờ</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-vcenter card-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Email</th>
                <th>Khóa học</th>
                <th>Trạng thái</th>
                <th>Tin nhắn</th>
                <th>Ngày tạo</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <!-- Trạng thái trống -->
              <tr v-if="!requests.length">
                <td colspan="6" class="text-center text-muted">
                  Không có yêu cầu nào.
                </td>
              </tr>
              <!-- Dòng yêu cầu -->
              <tr v-for="request in requests" :key="request._id">
                <td>{{ request.user.name || "N/A" }}</td>
                <td>{{ request.user.email || "N/A" }}</td>
                <td>{{ request.course.name || "N/A" }}</td>
                <td>
                  <span
                    :class="[
                      'badge',
                      request.status === 'pending'
                        ? 'bg-warning'
                        : request.status === 'approved'
                        ? 'bg-success'
                        : 'bg-danger',
                    ]"
                  >
                    {{ formatStatus(request.status) }}
                  </span>
                </td>
                <td>{{ request.message || "N/A" }}</td>
                <td>{{ formatDate(request.created_at) }}</td>
                <td v-show="request.status === 'pending'">
                  <button
                    @click="
                      updateJoinRequest(
                        request.user._id,
                        request.course._id,
                        request._id,
                        'approved'
                      )
                    "
                    class="btn btn-primary"
                  >
                    Chấp nhận
                  </button>
                </td>
                <td v-show="request.status === 'pending'">
                  <button
                    @click="
                      updateJoinRequest(
                        request.user._id,
                        request.course._id,
                        request._id,
                        'rejected'
                      )
                    "
                    class="btn btn-primary"
                  >
                    Huỷ yêu cầu
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="card-footer d-flex align-items-center">
        <select
          v-model="pagination.limit"
          class="form-select w-auto me-3"
          @change="fetchRequests"
        >
          <option :value="10">10 mỗi trang</option>
          <option :value="20">20 mỗi trang</option>
          <option :value="50">50 mỗi trang</option>
        </select>
        <ul class="pagination m-0 ms-auto">
          <li class="page-item" :class="{ disabled: pagination.page === 1 }">
            <a
              class="page-link"
              href="#"
              @click.prevent="
                pagination.page > 1 && changePage(pagination.page - 1)
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 6l-6 6l6 6" />
              </svg>
              Trước
            </a>
          </li>
          <li class="page-item">
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(pagination.page + 1)"
            >
              Tiếp
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 6l6 6l-6 6" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "JoinRequests",
  data() {
    return {
      requests: [],
      loading: false,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
      },
      filters: {
        status: "pending",
      },
    };
  },
  created() {
    this.debouncedFetchUsers = this.debounce(this.fetchRequests, 500);
    this.fetchRequests();
  },
  methods: {
    async fetchRequests() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          status: this.filters.status,
        };
        const response = await axios.get("/api/join-requests/center", {
          params,
        });
        console.log("Response: ", response);

        this.requests = response.data.data.requests;
        this.pagination.total = response.data.data.requests.length;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu cầu:", error);
      } finally {
        this.loading = false;
      }
    },
    async updateJoinRequest(studentId, couresId, id, auth) {
      try {
        console.log(studentId, " ", couresId, " ", id, " ", auth);
        const response = await axios.post(
          `/api/users/${studentId}/courses/${couresId}/join`,
          {
            joinRequestId: id,
            status: auth,
          }
        );
        console.log("Response: ", response);
        if (response.data.error) {
          alert("Yêu cầu chưa được thực hiện!");
          return;
        }
        alert("Yêu cầu được thực hiện!");
      } catch (error) {
        console.error("Lỗi khi yêu join request:", error);
      }
    },
    changePage(page) {
      this.pagination.page = page;
      this.fetchRequests();
    },
    formatStatus(status) {
      switch (status) {
        case "pending":
          return "Đang chờ";
        case "approved":
          return "Đã duyệt";
        case "rejected":
          return "Đã từ chối";
        default:
          return status;
      }
    },
    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      });
    },
    debounce(func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    },
  },
};
</script>

<style scoped>
.card-table {
  width: 100%;
}
.badge {
  font-size: 0.875rem;
}
</style>
