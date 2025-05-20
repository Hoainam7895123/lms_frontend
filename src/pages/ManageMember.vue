<template>
  <div class="container-xl">
    <div class="page-header d-print-none">
      <h2 class="page-title">Danh sách học viên</h2>
    </div>

    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div v-else-if="students.length === 0" class="empty">
          <div class="empty-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-users"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
            </svg>
          </div>
          <p class="empty-title">Không có học viên</p>
          <p class="empty-subtitle text-muted">
            Hiện tại khóa học này chưa có học viên nào.
          </p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-vcenter card-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Username</th>
                <th>Ngày tạo</th>
                <th class="w-1">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in students" :key="student._id">
                <td>{{ index + 1 }}</td>
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>{{ student.username }}</td>
                <td>{{ formatDate(student.created_at) }}</td>
                <td>
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteMember"
                    :disabled="deleting === student._id"
                  >
                    <svg
                      v-if="deleting === student._id"
                      class="icon icon-tabler icon-tabler-loader spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 6l0 -3" />
                      <path d="M16.25 7.75l2.15 -2.15" />
                      <path d="M18 12l3 0" />
                      <path d="M16.25 16.25l2.15 2.15" />
                      <path d="M12 18l0 3" />
                      <path d="M7.75 16.25l-2.15 2.15" />
                      <path d="M6 12l-3 0" />
                      <path d="M7.75 7.75l-2.15 -2.15" />
                    </svg>
                    <svg
                      v-else
                      class="icon icon-tabler icon-tabler-trash"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 7l16 0" />
                      <path d="M10 11l0 6" />
                      <path d="M14 11l0 6" />
                      <path
                        d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                      />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                    Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteMemberModal"
      class="modal modal-blur fade show"
      style="display: block"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xác nhận xóa</h5>
            <button
              type="button"
              class="btn-close"
              @click="showDeleteMemberModal = false"
            ></button>
          </div>
          <div class="modal-body">
            Bạn có chắc muốn xóa slide "{{
              deletingSlide?.title || "Không có tiêu đề"
            }}" không?
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              @click="showDeleteMemberModal = false"
            >
              Hủy
            </button>
            <button class="btn btn-danger" @click="confirmDeleteSlide">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "StudentList",
  data() {
    return {
      students: [],
      loading: true,
      error: null,
      showDeleteMemberModal: false,
    };
  },
  methods: {
    async fetchStudents() {
      try {
        const response = await axios.get(
          "/api/courses/67ff3305f7b66e3ea2d284a4/students"
        );

        if (!response.error) {
          this.students = response.data.data;
        } else {
          throw new Error("Không thể tải danh sách học viên");
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteStudent(studentId) {
      try {
        this.deleting = studentId;
        const response = await fetch(
          `/api/courses/67fe73981ba76ab7ca8e4d0e/students/${studentId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          this.students = this.students.filter(
            (student) => student._id !== studentId
          );
        } else {
          throw new Error("Không thể xóa học viên");
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.deleting = null;
      }
    },

    deleteMember() {
      this.showDeleteMemberModal = true;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  created() {
    this.fetchStudents();
  },
};
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
